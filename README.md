# To-Do List (Project 3)

A simple, lightweight To-Do List web app built with vanilla HTML, CSS, and JavaScript. Tasks are persisted in the browser via localStorage.

Features
- Add tasks with priority and optional due date
- Mark tasks complete / active
- Edit and delete tasks
- Filters: All / Active / Completed
- Search tasks
- Clear completed tasks

Run locally

1. Open `index.html` in your browser (quickest way):

   - Double-click `index.html` in your file explorer, or open it from your browser's File->Open.

2. Or serve with a simple HTTP server (recommended for some browsers/extensions):

   - Python 3: run in the project folder

     ```powershell
     python -m http.server 5500
     ```

     Then open http://localhost:5500 in your browser.

How it works

- Tasks are stored under the key `todo.tasks.v1` in localStorage as a JSON array of objects.
- The app is intentionally small and dependency-free for easy extension.

Next steps / ideas
- Add drag-and-drop ordering
- Add categories/tags
- Add recurring tasks and reminders
- Add tests or a small build step if converting to a framework
