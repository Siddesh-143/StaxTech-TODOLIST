// Simple To-Do app using localStorage
(function(){
  const STORAGE_KEY = 'todo.tasks.v1'

  // Elements
  const form = document.getElementById('task-form')
  const input = document.getElementById('task-input')
  const categorySelect = document.getElementById('category-select')
  const prioritySelect = document.getElementById('priority-select')
  const dueInput = document.getElementById('due-input')
  const list = document.getElementById('task-list')
  const countEl = document.getElementById('count')
  const progressFill = document.getElementById('progress-fill')
  const progressStats = document.getElementById('progress-stats')
  const clearBtn = document.getElementById('clear-completed')
  const filters = document.querySelectorAll('.filter')
  const searchInput = document.getElementById('search-input')

  let tasks = []
  let currentFilter = 'all'

  // Load
  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      tasks = raw ? JSON.parse(raw) : []
    }catch(e){ tasks = [] }
  }

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }

  function uid(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2,7)
  }

  function createTask(text, category, priority, due){
    return {
      id: uid(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      category: category || 'none',
      priority: priority || 'medium',
      due: due || null
    }
  }

  function updateProgress(){
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const percent = total ? Math.round((completed / total) * 100) : 0
    
    progressFill.style.width = `${percent}%`
    progressStats.textContent = `${percent}% Complete (${completed}/${total} tasks)`
  }

  function render(){
    const q = (searchInput.value || '').toLowerCase()
    list.innerHTML = ''
    const visible = tasks.filter(t=>{
      if(currentFilter === 'active' && t.completed) return false
      if(currentFilter === 'completed' && !t.completed) return false
      if(q && !t.text.toLowerCase().includes(q)) return false
      return true
    })

    visible.forEach(t=>{
      const li = document.createElement('li')
      li.className = 'task-item'
      li.dataset.id = t.id
      
      // Add slide-in animation with delay based on index
      li.style.animationDelay = `${visible.indexOf(t) * 50}ms`

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'checkbox'
      checkbox.checked = !!t.completed
      checkbox.setAttribute('aria-label','Toggle complete')

      const text = document.createElement('div')
      text.className = 'task-text'
      if(t.completed) text.classList.add('completed')
      text.textContent = t.text
      text.title = 'Double-click to edit'

      const meta = document.createElement('div')
      meta.className = 'meta'
      if(t.due) meta.textContent = 'Due: ' + t.due

      // Priority badge
      const priBadge = document.createElement('span')
      priBadge.className = 'badge ' + (t.priority||'medium')
      priBadge.textContent = (t.priority||'medium').toUpperCase()
      
      // Category badge (if set)
      const catBadge = document.createElement('span')
      if(t.category && t.category !== 'none') {
        catBadge.className = 'badge cat-' + t.category
        catBadge.textContent = t.category.charAt(0).toUpperCase() + t.category.slice(1)
      }

      const actions = document.createElement('div')
      actions.className = 'actions'

      const editBtn = document.createElement('button')
      editBtn.className = 'edit'
      editBtn.title = 'Edit'
      editBtn.textContent = 'Edit'

      const delBtn = document.createElement('button')
      delBtn.className = 'delete'
      delBtn.title = 'Delete'
      delBtn.textContent = 'Delete'

      actions.append(editBtn, delBtn)

      const badges = document.createElement('div')
      badges.className = 'badges'
      badges.append(priBadge)
      if(t.category && t.category !== 'none') {
        badges.append(catBadge)
      }

      li.append(checkbox, text, badges, meta, actions)
      list.appendChild(li)
    })

    countEl.textContent = tasks.length
    updateProgress()
    save()
  }

  function addTaskFromForm(e){
    e.preventDefault()
    const v = input.value.trim()
    if(!v) return
    const t = createTask(
      v,
      categorySelect.value,
      prioritySelect.value,
      dueInput.value || null
    )
    tasks.unshift(t)
    input.value = ''
    dueInput.value = ''
    categorySelect.value = 'none'
    prioritySelect.value = 'medium'
    render()
  }

  function findIndexById(id){ return tasks.findIndex(x=>x.id === id) }

  // Delegated clicks
  list.addEventListener('click', (ev)=>{
    const li = ev.target.closest('li')
    if(!li) return
    const id = li.dataset.id
    const idx = findIndexById(id)
    if(idx === -1) return

    if(ev.target.matches('.delete')){
      tasks.splice(idx,1)
      render()
      return
    }

    if(ev.target.matches('.edit')){
      const newText = prompt('Edit task', tasks[idx].text)
      if(newText !== null){
        tasks[idx].text = newText.trim() || tasks[idx].text
        render()
      }
      return
    }

    // checkbox click handled separately on change
  })

  // checkbox toggle
  list.addEventListener('change', (ev)=>{
    if(ev.target.type === 'checkbox'){
      const li = ev.target.closest('li')
      const id = li.dataset.id
      const idx = findIndexById(id)
      if(idx === -1) return
      tasks[idx].completed = !!ev.target.checked
      render()
    }
  })

  // double-click to edit text inline
  list.addEventListener('dblclick', (ev)=>{
    const textDiv = ev.target.closest('.task-text')
    if(!textDiv) return
    const li = ev.target.closest('li')
    const id = li.dataset.id
    const idx = findIndexById(id)
    if(idx === -1) return
    const newText = prompt('Edit task', tasks[idx].text)
    if(newText !== null){ tasks[idx].text = newText.trim() || tasks[idx].text; render() }
  })

  // filters
  document.querySelector('.controls').addEventListener('click', (ev)=>{
    if(ev.target.classList.contains('filter')){
      filters.forEach(b=>b.classList.remove('active'))
      ev.target.classList.add('active')
      currentFilter = ev.target.dataset.filter || 'all'
      render()
    }
  })

  searchInput.addEventListener('input', ()=>render())

  clearBtn.addEventListener('click', ()=>{
    tasks = tasks.filter(t=>!t.completed)
    render()
  })

  // Form
  form.addEventListener('submit', addTaskFromForm)

  // Initialize
  load()
  render()

  // Expose for debugging (optional)
  window.todoApp = { tasks, render }
})()
