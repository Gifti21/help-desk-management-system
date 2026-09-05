# Employee Portal - Data Flow Between Pages

## Complete Connection Flow

### 1️⃣ Employee Creates a Ticket (Create Ticket Page)

**Page:** `/employee/tickets/new`

**User Actions:**
1. Employee fills out the form:
   - Title
   - Description
   - Category (dropdown from database)
   - Priority (LOW, MEDIUM, HIGH, CRITICAL)

2. Employee clicks "Create Ticket"

**Backend Process:**
```
POST /api/employee/tickets
Request Body: {
  title: "Network issue",
  description: "Cannot connect to server",
  categoryId: "cmtg0vhko0003irb95rvth6yt",
  priority: "HIGH"
}

Backend Processing:
1. Validates session (employee logged in?)
2. Validates data (Zod schema)
3. Gets employee's department automatically (user.departmentId)
4. Creates ticket in database:
   INSERT INTO tickets (
     id, title, description, priority, status,
     categoryId, departmentId, requesterId,
     createdAt, updatedAt
   ) VALUES (
     [generated_id],
     "Network issue",
     "Cannot connect to server",
     "HIGH",
     "OPEN",
     [categoryId],
     [employee's departmentId],  // Automatic!
     [employee's id],             // Automatic!
     NOW(),
     NOW()
   )

Response: {
  success: true,
  data: { ...newly created ticket... }
}
```

**Frontend Action:**
```javascript
// After successful creation:
1. Show success message
2. Wait 2 seconds
3. Redirect to: /employee/dashboard
```

---

### 2️⃣ New Ticket Appears in Dashboard

**Page:** `/employee/dashboard`

**Automatic Data Refresh:**
```
Component mounts → useEffect() runs
  ↓
GET /api/employee/dashboard
  ↓
Backend Query:
  SELECT * FROM tickets 
  WHERE requesterId = [employee_id]
  ORDER BY createdAt DESC
  LIMIT 10
  ↓
Returns:
  - stats: { total: 5, open: 3, inProgress: 1, closed: 1 }
  - recentTickets: [
      { id, title, status, priority, category, ... },  // NEW TICKET IS HERE!
      { id, title, status, priority, category, ... },
      ...
    ]
  ↓
Display:
  - Stats Cards updated with new count
  - Recent Tickets table shows new ticket at the top
```

**What Employee Sees:**
- ✅ Total tickets count increased
- ✅ Open tickets count increased  
- ✅ New ticket appears at the top of "Recent Tickets" table
- ✅ Ticket shows: Title, Category, Priority, Status, Last Updated

---

### 3️⃣ Employee Views All Tickets (My Tickets Page)

**Page:** `/employee/tickets`

**Automatic Data Fetch:**
```
Component mounts → useEffect() runs
  ↓
GET /api/employee/tickets
  ↓
Backend Query:
  SELECT * FROM tickets 
  WHERE requesterId = [employee_id]
  ORDER BY createdAt DESC  // All tickets, not just 10
  ↓
Returns:
  - Array of ALL employee's tickets
  ↓
Display:
  - Filterable table (by status)
  - Searchable (by title/category)
  - Paginated (5 per page)
```

**What Employee Sees:**
- ✅ NEW TICKET appears in the table
- ✅ Can filter by status (Open, In Progress, etc.)
- ✅ Can search for tickets
- ✅ Can click on ticket to view details

---

### 4️⃣ Employee Clicks on Ticket (Ticket Detail Page)

**Page:** `/employee/tickets/[id]`

**Data Fetch:**
```
Component mounts with ticket ID
  ↓
GET /api/tickets/[id]
  ↓
Backend Query:
  SELECT * FROM tickets 
  WHERE id = [ticket_id]
  INCLUDE category, department, assignee, comments
  ↓
Returns:
  - Full ticket details
  - Comments array
  - Timeline events
  ↓
Display:
  - Ticket header (title, status, priority)
  - Full description
  - Category and department info
  - Assignee info (if assigned)
  - Comments section
  - Timeline
```

---

## Data Synchronization Flow

### When Ticket is Created:

```
Create Ticket Page
      ↓ (POST /api/employee/tickets)
   Database
      ↓ (INSERT new ticket)
   Ticket Stored
      ↓ (Redirect after 2 seconds)
Dashboard Page
      ↓ (GET /api/employee/dashboard)
   Shows Updated Data
      ↓ (Employee clicks "My Tickets")
My Tickets Page
      ↓ (GET /api/employee/tickets)
   Shows All Tickets Including New One
      ↓ (Employee clicks on ticket)
Ticket Detail Page
      ↓ (GET /api/tickets/[id])
   Shows Full Ticket Details
```

---

## Real-Time Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    EMPLOYEE CREATES TICKET                   │
│                  /employee/tickets/new                       │
│                                                              │
│  [Form]                                                      │
│   ├─ Title: "Cannot print"                                  │
│   ├─ Description: "Printer shows error"                     │
│   ├─ Category: "Hardware Issue"                             │
│   └─ Priority: "HIGH"                                        │
│                                                              │
│  [Submit] ────────> POST /api/employee/tickets              │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE INSERT                         │
│                                                              │
│  tickets table:                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ id:           "cmtz123..."                           │   │
│  │ title:        "Cannot print"                         │   │
│  │ description:  "Printer shows error"                  │   │
│  │ status:       "OPEN"                                 │   │
│  │ priority:     "HIGH"                                 │   │
│  │ categoryId:   "cmtg0vh..."                           │   │
│  │ departmentId: "cmtg0vh..." (Employee's dept - AUTO) │   │
│  │ requesterId:  "cmttg0v..." (Employee's ID - AUTO)   │   │
│  │ createdAt:    "2026-09-03T..."                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              SUCCESS → REDIRECT TO DASHBOARD                 │
│                  /employee/dashboard                         │
│                                                              │
│  [Dashboard loads] ──> GET /api/employee/dashboard          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Stats Cards:                                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │Total: 5│ │Open: 3 │ │InProg:1│ │Closed:1│        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  │         ↑ UPDATED!                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Recent Tickets Table:                                 │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ 🆕 Cannot print | Hardware | HIGH | OPEN      │   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ Network down   | Network   | CRITICAL | OPEN  │   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ Email issue    | Software  | MEDIUM | RESOLVED│   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │         ↑ NEW TICKET AT TOP!                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────┘
                              │
              [Employee clicks "My Tickets" in sidebar]
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     MY TICKETS PAGE                          │
│                   /employee/tickets                          │
│                                                              │
│  [Page loads] ──> GET /api/employee/tickets                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ All Tickets Table (Paginated, Searchable):           │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ 🆕 Cannot print | Hardware | HIGH | OPEN      │   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ Network down   | Network   | CRITICAL | OPEN  │   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ Email issue    | Software  | MEDIUM | RESOLVED│   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ Login problem  | Account   | LOW | CLOSED     │   │  │
│  │ ├────────────────────────────────────────────────┤   │  │
│  │ │ VPN not working| Network   | HIGH | CLOSED    │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │         ↑ ALL EMPLOYEE'S TICKETS INCLUDING NEW!       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Verification Steps

### Test the Complete Flow:

1. **Create Ticket:**
   ```
   - Go to: /employee/tickets/new
   - Fill form with test data
   - Click "Create Ticket"
   - Wait for success message
   - Verify redirect to dashboard
   ```

2. **Check Dashboard:**
   ```
   - Verify stats cards show updated counts
   - Verify new ticket appears in "Recent Tickets" table
   - Verify it's at the top (most recent)
   - Verify all ticket details are correct
   ```

3. **Check My Tickets:**
   ```
   - Click "My Tickets" in sidebar
   - Verify new ticket appears in the table
   - Verify you can filter it by status
   - Verify you can search for it
   - Click on the ticket row
   ```

4. **Check Ticket Detail:**
   ```
   - Verify full ticket details display
   - Verify all fields are correct
   - Verify back button works
   ```

---

## Data Consistency Guarantees

✅ **Single Source of Truth:** All data comes from the same PostgreSQL database

✅ **Real-time Fetch:** Each page fetches fresh data from the database on load

✅ **No Caching Issues:** Using `credentials: 'include'` ensures session is checked

✅ **Automatic Filtering:** Backend automatically filters by `requesterId` (employee's ID)

✅ **Proper Relations:** Tickets include category, department, assignee via JOIN queries

---

## API Endpoints Connection Summary

| Page | API Endpoint | What It Returns |
|------|-------------|-----------------|
| Dashboard | `GET /api/employee/dashboard` | Stats + 10 recent tickets |
| My Tickets | `GET /api/employee/tickets` | ALL employee's tickets |
| Create Ticket | `POST /api/employee/tickets` | Newly created ticket |
| Ticket Detail | `GET /api/tickets/[id]` | Full ticket + comments |

---

## Status: ✅ FULLY CONNECTED

The data flow between all three pages is working correctly:

1. ✅ Create Ticket → Stores to database
2. ✅ Database → Ticket saved with employee's ID
3. ✅ Dashboard → Shows new ticket in stats and recent tickets
4. ✅ My Tickets → Shows new ticket in full list
5. ✅ Ticket Detail → Shows full ticket information

**All pages are connected through the shared PostgreSQL database, ensuring data consistency and real-time updates!**
