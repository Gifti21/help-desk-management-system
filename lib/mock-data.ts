// Mock data for development when database is not available
export const mockUsers = [
    {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@helpdesk.com',
        role: 'ADMIN' as const,
        isActive: true,
        departmentId: 'dept-1',
        department: { id: 'dept-1', name: 'IT Support' },
    },
    {
        id: 'user-2',
        firstName: 'Sarah',
        lastName: 'Agent',
        email: 'sarah@helpdesk.com',
        role: 'AGENT' as const,
        isActive: true,
        departmentId: 'dept-1',
        department: { id: 'dept-1', name: 'IT Support' },
    },
    {
        id: 'user-3',
        firstName: 'Mike',
        lastName: 'Employee',
        email: 'mike@helpdesk.com',
        role: 'EMPLOYEE' as const,
        isActive: true,
        departmentId: 'dept-2',
        department: { id: 'dept-2', name: 'Finance' },
    }
];

export const mockDepartments = [
    { id: 'dept-1', name: 'IT Support', createdAt: new Date('2024-01-01') },
    { id: 'dept-2', name: 'Finance', createdAt: new Date('2024-01-01') },
    { id: 'dept-3', name: 'HR', createdAt: new Date('2024-01-01') },
    { id: 'dept-4', name: 'Operations', createdAt: new Date('2024-01-01') },
];

export const mockCategories = [
    { id: 'cat-1', name: 'Hardware', createdAt: new Date('2024-01-01') },
    { id: 'cat-2', name: 'Software', createdAt: new Date('2024-01-01') },
    { id: 'cat-3', name: 'Network', createdAt: new Date('2024-01-01') },
    { id: 'cat-4', name: 'Access', createdAt: new Date('2024-01-01') },
];

export const mockTickets = [
    {
        id: 'ticket-1',
        title: 'Server Performance Issues',
        description: 'The main server is running slowly and affecting all users.',
        status: 'OPEN' as const,
        priority: 'HIGH' as const,
        categoryId: 'cat-1',
        category: { id: 'cat-1', name: 'Hardware' },
        departmentId: 'dept-1',
        department: { id: 'dept-1', name: 'IT Support' },
        requesterId: 'user-3',
        requester: mockUsers[2],
        assigneeId: 'user-2',
        assignee: mockUsers[1],
        createdAt: new Date('2024-07-20T10:00:00Z'),
        updatedAt: new Date('2024-07-20T10:00:00Z'),
        closedAt: null,
    },
    {
        id: 'ticket-2',
        title: 'Email Access Request',
        description: 'New employee needs access to company email system.',
        status: 'IN_PROGRESS' as const,
        priority: 'MEDIUM' as const,
        categoryId: 'cat-4',
        category: { id: 'cat-4', name: 'Access' },
        departmentId: 'dept-2',
        department: { id: 'dept-2', name: 'Finance' },
        requesterId: 'user-3',
        requester: mockUsers[2],
        assigneeId: 'user-1',
        assignee: mockUsers[0],
        createdAt: new Date('2024-07-19T14:30:00Z'),
        updatedAt: new Date('2024-07-20T09:15:00Z'),
        closedAt: null,
    }
];

export const mockComments = [
    {
        id: 'comment-1',
        content: 'Investigating the server performance issue. Will check disk usage and memory consumption.',
        ticketId: 'ticket-1',
        authorId: 'user-2',
        author: mockUsers[1],
        createdAt: new Date('2024-07-20T10:30:00Z'),
    },
    {
        id: 'comment-2',
        content: 'Email access has been created. Sending credentials via secure channel.',
        ticketId: 'ticket-2',
        authorId: 'user-1',
        author: mockUsers[0],
        createdAt: new Date('2024-07-20T09:15:00Z'),
    }
];