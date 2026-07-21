# Git Workflow Guide for Interns (Using VS Code)

This guide explains how to use Git and GitHub for collaboration on the Help Desk Management System project using **VS Code's built-in Git interface**. No terminal commands needed! Following this workflow ensures that your code is properly reviewed and integrated without conflicts.

## 🎯 Why Do We Need a Git Workflow?

Think of Git like a save system for your code. It allows multiple people to work on the same project without overwriting each other's work. The workflow described here ensures:

- Everyone works on their own copy (branch) of the code
- Changes are reviewed before being merged
- The main code stays stable and working
- We can track who made what changes and why

---

## 📚 Key Git Concepts (In Simple Terms)

### What is a Branch?
A **branch** is like a separate copy of the project where you can make changes without affecting the main code. Think of it as a sandbox where you can experiment safely.

### What is a Pull Request (PR)?
A **Pull Request** is a request to merge your branch into the main code. It's like saying "Hey, I made some changes. Can you review them and add them to the main project?"

### What is the Main Branch?
The **main branch** (often called `main` or `master`) is the official, stable version of the code. Only working, tested code goes here.

---

## 🔄 The Workflow (Step by Step)

### How to Access Git in VS Code

Before starting, find the **Source Control** icon in VS Code:
- Look at the left sidebar (the Activity Bar)
- Click the **Source Control** icon (looks like a branching diagram)
- Or press `Ctrl+Shift+G` (Windows) or `Cmd+Shift+G` (Mac)

This opens the Source Control panel where you'll see all your changes.

---

### Scenario 1: Starting a New Feature

**When to use this:** You're working on a new feature that doesn't have a branch yet.

#### Step 1: Update Your Local Code
Before starting, make sure you have the latest version of the code:

1. Click the **Source Control** icon in the left sidebar
2. Look at the bottom of the Source Control panel
3. Click the branch name (it will show something like `main` or `feature/...`)
4. Select `main` from the dropdown if you're not already on it
5. Click the **...** (three dots) menu in the Source Control panel
6. Select **Pull** to get the latest changes from GitHub

#### Step 2: Create a New Branch
Create a new branch with a descriptive name:

1. In the Source Control panel, click the branch name at the bottom
2. Click **+ Create new branch**
3. Type your branch name and press Enter

**Branch Naming Rules:**
- Use lowercase letters and hyphens
- Start with the type: `feature/`, `bugfix/`, or `hotfix/`
- Be descriptive: `feature/login-page` is better than `feature/new-stuff`

**Examples:**
- `feature/ticket-list-page`
- `feature/user-management`
- `bugfix/login-error`
- `hotfix/critical-security-fix`

#### Step 3: Make Your Changes
Write your code, make changes to files, etc. As you work, you'll see the files appear in the Source Control panel with indicators:
- **M** = Modified
- **A** = Added (new file)
- **D** = Deleted
- **U** = Untracked (new file not yet added to Git)

#### Step 4: Review Your Changes
See which files you've modified:

1. Look at the Source Control panel
2. You'll see a list of all changed files
3. Click on any file to see a side-by-side comparison of what changed
4. The left side shows the original, the right side shows your changes

#### Step 5: Stage Your Changes
Tell Git which files you want to include in your commit:

**Option A - Stage all changes:**
1. In the Source Control panel, click the **+** button next to "Changes"
2. This moves all files to "Staged Changes"

**Option B - Stage specific files:**
1. Click the **+** button next to individual files
2. Only those files will be staged

**Option C - Stage parts of a file:**
1. Click on a file to see the changes
2. Hover over specific lines you want to stage
3. Click the **+** that appears on the left side of those lines
4. This stages only those specific changes

#### Step 6: Commit Your Changes
Save your changes with a descriptive message:

1. In the Source Control panel, you'll see a text box that says "Message"
2. Type a descriptive message about what you changed
3. Click the **✓** (checkmark) button to commit

**Commit Message Rules:**
- Use present tense: "Add login form" not "Added login form"
- Be specific: "Add login form with email validation" is better than "Add form"
- Keep it under 50 characters if possible

**Examples:**
- `Add ticket list page component`
- `Fix user authentication bug`
- `Update database schema for phone numbers`

#### Step 7: Push Your Branch to GitHub
Send your branch to GitHub:

1. In the Source Control panel, look at the bottom
2. You'll see a message like "Your branch is ahead of 'origin/feature-name' by 1 commit"
3. Click the **Publish Branch** button (or **Sync Changes** if it's already published)
4. VS Code will push your branch to GitHub

#### Step 8: Create a Pull Request (PR)

**Option A - From VS Code:**
1. After pushing, VS Code might show a notification: "Would you like to create a Pull Request?"
2. Click the notification
3. Fill in the PR details in the browser that opens

**Option B - From GitHub:**
1. Go to GitHub in your browser
2. You should see a banner suggesting you create a Pull Request
3. Click "Compare & pull request"
4. Fill in the PR details:
   - **Title**: Short description of your changes
   - **Description**: More details about what you did and why
   - **Reviewers**: Select people who should review your code
5. Click "Create pull request"

**PR Description Template:**
```
## What I Changed
- Brief description of changes

## Why I Made These Changes
- Explanation of the problem or feature

## How to Test
- Steps to test your changes

## Screenshots (if applicable)
- Add screenshots if you changed the UI
```

#### Step 9: Wait for Review and Merge
- I or Fuad will review your code
- We might ask for changes
- Make requested changes, commit, and push (see Scenario 2)
- Once approved, your code will be merged into main

---

### Scenario 2: Updating an Existing Branch/PR

**When to use this:** You already have a branch and PR open, and you want to add more changes.

#### Step 1: Switch to Your Branch
1. Click the **Source Control** icon in the left sidebar
2. Click the branch name at the bottom of the Source Control panel
3. Select your feature branch from the dropdown

#### Step 2: Get the Latest Changes from Main
This helps prevent conflicts later:

1. Click the **...** (three dots) menu in the Source Control panel
2. Select **Pull** from the menu
3. This will pull the latest changes from the remote branch

**Note:** If there are conflicts, resolve them (see the "Handling Conflicts" section below).

#### Step 3: Make Your New Changes
Write your new code or modify existing code.

#### Step 4: Stage, Commit, and Push
1. In the Source Control panel, stage your changes (click the **+** button next to files or "Changes")
2. Type a commit message in the message box
3. Click the **✓** (checkmark) button to commit
4. Click the **Sync Changes** button at the bottom of the Source Control panel

**Important:** When you push to an existing branch, the PR automatically updates with your new changes. You don't need to create a new PR!

---

### Scenario 3: Working on Someone Else's Branch

**When to use this:** If you get asked to help with their feature.

#### Step 1: Fetch All Branches
1. Click the **Source Control** icon in the left sidebar
2. Click the **...** (three dots) menu
3. Select **Fetch** to get all the latest branches from GitHub

#### Step 2: Checkout Their Branch
1. Click the branch name at the bottom of the Source Control panel
2. Select their branch from the dropdown (you might need to scroll to find it)
3. If you don't see it, type the branch name in the search box

#### Step 3: Make Changes
Work on the code as needed.

#### Step 4: Stage, Commit, and Push
1. In the Source Control panel, stage your changes (click the **+** button)
2. Type a commit message
3. Click the **✓** (checkmark) button to commit
4. Click the **Sync Changes** button to push

**Note:** If you don't have permission to push to their branch, you'll need to:
1. Create your own branch from theirs (click branch name → + Create new branch from...)
2. Make your changes
3. Push your branch
4. Create a PR back to their branch

---

## ⚠️ Handling Merge Conflicts

A **merge conflict** happens when two people changed the same part of the same file. Git doesn't know which version to keep.

### When Conflicts Happen:
When you try to pull or sync changes, VS Code will show you a message about conflicts, and conflicted files will appear in the Source Control panel with a special indicator.

### How to Resolve Conflicts in VS Code:

#### Step 1: Open the Conflicted File
1. In the Source Control panel, you'll see conflicted files listed under "Merge Changes"
2. Click on a conflicted file to open it
3. VS Code will show you the conflict with special markers

#### Step 2: Use VS Code's Conflict Resolution Tool
VS Code makes this easy with a built-in conflict resolver:

1. Look at the top of the file - you'll see buttons like:
   - **Accept Current Change** (keep your version)
   - **Accept Incoming Change** (keep their version)
   - **Accept Both** (combine both versions)
   - **Compare Changes** (see side-by-side)

2. Click the appropriate button for each conflict
3. You can also manually edit the file to choose exactly what you want

**Manual Editing (if needed):**
If you prefer to edit manually, you'll see conflict markers like this:
```typescript
<<<<<<< HEAD
// Your changes
const x = 1;
=======
// Their changes
const x = 2;
>>>>>>> feature/their-branch
```

Edit the file to keep what you want and remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).

#### Step 3: Mark as Resolved
1. After resolving all conflicts in a file, save the file (`Ctrl+S` or `Cmd+S`)
2. In the Source Control panel, the file will move to "Staged Changes"
3. Or click the **Resolve** button if it appears

#### Step 4: Complete the Merge
1. Once all conflicts are resolved, click the **Source Control** icon
2. You'll see a message like "All conflicts resolved"
3. Click the **Continue** button if prompted
4. Or simply commit the resolved changes

#### Step 5: Push
1. Click the **Sync Changes** button at the bottom of the Source Control panel
2. This will push your resolved changes to GitHub

**Tip:** If you're unsure how to resolve a conflict, ask Me or Fuad for help! It's better to ask than to break something.

---

## 📋 Daily Workflow (What to Do Each Day)

### Starting Your Work Day:
1. **Switch to main and update:**
   - Click the **Source Control** icon in the left sidebar
   - Click the branch name at the bottom
   - Select `main` from the dropdown
   - Click the **...** (three dots) menu
   - Select **Pull** to get the latest changes

2. **Switch to your feature branch:**
   - Click the branch name at the bottom
   - Select your feature branch from the dropdown

3. **Get latest changes from main:**
   - Click the **...** (three dots) menu
   - Select **Pull** to sync your branch with the remote

4. **Start coding!**

### During the Day:
- **Commit often:** Commit your changes frequently with clear messages
  - Stage changes by clicking the **+** button
  - Type a message and click the **✓** button
- **Push regularly:** Push your commits to GitHub regularly (at least a few times a day)
  - Click the **Sync Changes** button at the bottom of the Source Control panel

### Ending Your Work Day:
- **Commit and push:** Make sure all your work is committed and pushed
  - Check the Source Control panel - there should be no files in "Changes"
  - Click **Sync Changes** to make sure everything is on GitHub
- **Check your PR:** If you have an open PR, check for review comments on GitHub

---

## 🚫 Common Mistakes to Avoid

### 1. Working Directly on Main
**Don't do this:**
- Click the branch name and select `main`
- Make changes while on main ❌

**Do this instead:**
- Click the branch name
- Click **+ Create new branch**
- Make changes on your new branch ✅

### 2. Forgetting to Pull Before Starting
Always pull the latest changes before starting work:
- Click the **Source Control** icon
- Click the branch name and select `main`
- Click the **...** menu
- Select **Pull**

### 3. Committing Without Messages
**Don't do this:**
- Leave the commit message empty ❌
- Type a vague message like "fix" ❌

**Do this instead:**
- Type a clear, descriptive message like "Fix login button not responding on mobile" ✅

### 4. Pushing Large, Unrelated Changes
Keep your commits focused on one thing. Don't mix bug fixes with new features in the same commit. Make separate commits for separate changes.

### 5. Not Updating Your PR
When you make new changes, always push them. Your PR will update automatically when you click **Sync Changes**.

---

## 🔧 Useful VS Code Git Actions

### Viewing Changes:
- **See what files changed:** Look at the Source Control panel - all changed files are listed
- **See what changed in a file:** Click on a file to see a side-by-side comparison
- **See commit history:** Click the **...** (three dots) menu → Select **View History**

### Branch Management:
- **List all branches:** Click the branch name at the bottom to see all branches
- **Switch to a branch:** Click the branch name and select from the dropdown
- **Create a new branch:** Click the branch name → Click **+ Create new branch**

### Undoing Mistakes:
- **Undo changes to a file (not committed):** Click on a file in the Source Control panel → Click the **discard** icon (trash can/undo icon)
- **Unstage a file:** In the Source Control panel, click the **-** button next to a staged file
- **Modify the last commit:** Click the **...** menu → Select **Undo Last Commit** (this will uncommit but keep changes)

### Other Useful Actions:
- **Discard all changes:** Click the **...** menu → Select **Discard All Changes**
- **Stash changes:** Click the **...** menu → Select **Stash** (saves changes temporarily)
- **Apply stashed changes:** Click the **...** menu → Select **Pop Stash**

---

## 📝 Quick Reference Cheat Sheet (VS Code)

| Task | How to Do It in VS Code |
|------|-------------------------|
| Start a new feature | Click branch name → + Create new branch |
| Save changes | Stage files (+) → Type message → Click ✓ |
| Send to GitHub | Click Sync Changes or Publish Branch |
| Update from main | Click ... menu → Select Pull |
| See changes | Look at Source Control panel |
| Switch branches | Click branch name → Select from dropdown |
| Resolve conflict | Click file → Accept changes → Save → Sync |

---

## 🆘 Troubleshooting

### "Permission Denied" Error
If you can't push:
1. Check if you have permission to push to that branch
2. Make sure you're on your own branch, not someone else's (check the branch name at the bottom)
3. Check your GitHub authentication in VS Code settings

### "Branch Does Not Exist" Error
If a branch doesn't exist:
1. Click the **...** menu in Source Control
2. Select **Fetch** to get all branches from GitHub
3. Check if the branch name is correct
4. If it's a new branch, create it first

### PR Not Updating
If your PR doesn't show new commits:
1. Make sure you pushed to the correct branch (check the branch name at the bottom)
2. Click **Sync Changes** to ensure all commits are pushed
3. Refresh the GitHub page in your browser

### Can't See the Source Control Panel
If you can't find the Git interface:
1. Look at the left sidebar (Activity Bar)
2. Click the Source Control icon (looks like a branching diagram)
3. Or press `Ctrl+Shift+G` (Windows) or `Cmd+Shift+G` (Mac)
4. If it's still not there, you may need to enable it in VS Code settings

---

## 💡 Best Practices

1. **Commit often** - Small, frequent commits are better than one giant commit
   - Stage and commit your work regularly (every hour or so)
   - This makes it easier to track progress and undo mistakes

2. **Write clear messages** - Your team should understand what you did just by reading the commit message
   - Be specific about what changed and why
   - Use present tense: "Add button" not "Added button"

3. **Keep branches focused** - One branch = one feature or bug fix
   - Don't mix unrelated changes in the same branch
   - Create separate branches for separate features

4. **Update regularly** - Pull from main frequently to avoid big conflicts
   - At least once a day, click **Pull** to get the latest changes
   - This prevents big merge conflicts later

5. **Review before creating a PR** - Look at your own changes before creating a Pull Request
   - Click on files in the Source Control panel to review your changes
   - Make sure you're only committing what you intended

6. **Delete old branches** - After merging, delete your feature branch to keep things clean
   - In VS Code, click the branch name
   - Find the merged branch and delete it
   - Or delete it from GitHub after the PR is merged

---

## 🎓 Summary

**Remember this VS Code workflow:**
1. Click the Source Control icon in the left sidebar
2. Create a branch for your feature (click branch name → + Create new branch)
3. Make changes and commit them (stage with +, type message, click ✓)
4. Push your branch to GitHub (click Sync Changes or Publish Branch)
5. Create a Pull Request (from VS Code notification or GitHub)
6. Wait for review
7. Make requested changes and push (PR updates automatically when you click Sync Changes)
8. Celebrate when merged! 🎉

**Golden Rule:** Never work directly on `main` or `Master`. Always create a branch for your work.

---

## 🎯 VS Code Git Interface Quick Tour

**Source Control Panel (Left Sidebar):**
- **Top section:** Shows all changed files (M = modified, A = added, D = deleted)
- **Middle section:** Shows staged changes (files ready to commit)
- **Bottom section:** Branch selector and sync buttons
- **Three dots menu (...):** Additional actions (Pull, Push, Fetch, Stash, etc.)

**Key Buttons:**
- **+** (plus): Stage changes (move from "Changes" to "Staged Changes")
- **-** (minus): Unstage changes (move from "Staged Changes" back to "Changes")
- **✓** (checkmark): Commit staged changes
- **Sync Changes / Publish Branch:** Push changes to GitHub
- **Discard icon:** Undo changes to a file

**Keyboard Shortcuts:**
- `Ctrl+Shift+G` (Windows) or `Cmd+Shift+G` (Mac): Open Source Control panel
- `Ctrl+S` or `Cmd+S`: Save file

---

**Need help?** Ask a Me or Fuad. Using Git in VS Code is much easier than using the terminal, and you'll get comfortable with it quickly!
