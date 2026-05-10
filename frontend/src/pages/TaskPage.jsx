import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import EditTaskPage from './EditTaskPage.jsx'
import Navbar from './Navbar.jsx'

const emptyForm = {
  title: '',
  description: '',
  status: 'TO_DO',
  dueDate: '',
}

const statusLabels = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

const today = new Date().toISOString().slice(0, 10)

function TaskPage({ apiUrl, auth, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingTask, setEditingTask] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [toast, setToast] = useState('')
  const [fabPosition, setFabPosition] = useState(null)
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const createButtonRef = useRef(null)
  const toastRef = useRef(null)
  const fabDragRef = useRef({
    isDragging: false,
    hasMoved: false,
    suppressClick: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${auth.token}`,
    }),
    [auth.token],
  )

  useEffect(() => {
    loadTasks()
  }, [statusFilter])

  useEffect(() => {
    animate(pageRef.current, {
      opacity: [0, 1],
      y: [22, 0],
      duration: 520,
      ease: 'outQuad',
    })

    animate(formRef.current.querySelectorAll('label, button'), {
      opacity: [0, 1],
      x: [-14, 0],
      delay: stagger(70),
      duration: 380,
      ease: 'outQuad',
    })

    animate(pageRef.current.querySelectorAll('.summary-card'), {
      opacity: [0, 1],
      y: [18, 0],
      delay: stagger(90),
      duration: 420,
      ease: 'outQuad',
    })
  }, [])

  useEffect(() => {
    if (tasks.length === 0) {
      return
    }

    animate('.task-card', {
      opacity: [0, 1],
      y: [18, 0],
      duration: 420,
      delay: stagger(55),
      ease: 'outQuad',
    })
  }, [tasks])

  useEffect(() => {
    if (!toast) {
      return
    }

    animate(toastRef.current, {
      opacity: [0, 1],
      x: [24, 0],
      duration: 260,
      ease: 'outQuad',
    })
  }, [toast])

  const loadTasks = async () => {
    const query = statusFilter === 'ALL' ? '' : `?status=${statusFilter}`
    const response = await fetch(`${apiUrl}/tasks${query}`, {
      headers: authHeaders,
    })

    if (response.ok) {
      setTasks(await response.json())
    }
  }

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setFieldErrors({ ...fieldErrors, [event.target.name]: '' })
  }

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2500)
  }

  const openCreateModal = () => {
    setMessage('')
    setFieldErrors({})
    setShowCreateModal(true)
  }

  const moveFab = (event) => {
    const drag = fabDragRef.current
    if (!drag.isDragging) {
      return
    }

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.hasMoved = true
    }

    const size = 64
    const padding = 12
    const maxX = window.innerWidth - size - padding
    const maxY = window.innerHeight - size - padding
    const nextX = Math.min(Math.max(padding, drag.originX + deltaX), maxX)
    const nextY = Math.min(Math.max(padding, drag.originY + deltaY), maxY)

    setFabPosition({ x: nextX, y: nextY })
  }

  const stopFabDrag = (event) => {
    const drag = fabDragRef.current
    if (!drag.isDragging) {
      return
    }

    drag.isDragging = false
    drag.suppressClick = drag.hasMoved
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const startFabDrag = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    fabDragRef.current = {
      isDragging: true,
      hasMoved: false,
      suppressClick: false,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
    }
    setFabPosition({ x: rect.left, y: rect.top })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const validateTask = (taskForm) => {
    const errors = {}

    if (!taskForm.title.trim()) {
      errors.title = 'Title is required'
    }

    if (taskForm.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or less'
    }

    if (taskForm.description.trim().length > 500) {
      errors.description = 'Description must be 500 characters or less'
    }

    if (!taskForm.status) {
      errors.status = 'Status is required'
    }

    if (!taskForm.dueDate) {
      errors.dueDate = 'Due date is required'
    }

    if (taskForm.dueDate && taskForm.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
    }

    return errors
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')

    const validationErrors = validateTask(form)
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setMessage('Please fix the highlighted fields')
      animate(formRef.current, {
        x: [-6, 6, -4, 4, 0],
        duration: 320,
        ease: 'outQuad',
      })
      return
    }

    setFieldErrors({})

    animate(createButtonRef.current, {
      scale: [1, 0.96, 1],
      duration: 360,
      ease: 'outBack',
    })

    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        dueDate: form.dueDate || null,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      setMessage(error?.message || 'Please check the task details')
      return
    }

    setForm(emptyForm)
    setShowCreateModal(false)
    await loadTasks()
    showToast('Task created successfully')
  }

  const editTask = (task) => {
    setEditingTask(task)
  }

  const closeEditModal = () => {
    setEditingTask(null)
  }

  const saveEdit = async (taskForm) => {
    const response = await fetch(`${apiUrl}/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskForm),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      return error?.message || 'Please check the task details'
    }

    closeEditModal()
    await loadTasks()
    showToast('Task updated successfully')
    return ''
  }

  const deleteTask = async (id) => {
    const response = await fetch(`${apiUrl}/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })

    if (response.ok) {
      await loadTasks()
      showToast('Task deleted successfully')
    }
  }

  const updateStatus = async (task, status) => {
    const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, status }),
    })

    if (response.ok) {
      await loadTasks()
      showToast('Status updated successfully')
    }
  }

  const visibleTasks = tasks.filter((task) => {
    const text = `${task.title} ${task.description}`.toLowerCase()
    return text.includes(search.trim().toLowerCase())
  })

  const taskSummary = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'TO_DO').length,
    progress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }

  const renderCreateForm = (extraClassName = '') => (
    <form
      ref={formRef}
      className={`task-form ${extraClassName}`}
      onSubmit={submit}
    >
      <div className="page-header">
        <h2>Create Task</h2>
      </div>

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          maxLength="100"
          aria-invalid={Boolean(fieldErrors.title)}
          required
        />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          maxLength="500"
          rows="4"
          aria-invalid={Boolean(fieldErrors.description)}
        />
        <span className="field-hint">
          {form.description.length}/500 characters
        </span>
        {fieldErrors.description && (
          <span className="field-error">{fieldErrors.description}</span>
        )}
      </label>

      <label>
        Status
        <select
          name="status"
          value={form.status}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.status)}
          required
        >
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {fieldErrors.status && <span className="field-error">{fieldErrors.status}</span>}
      </label>

      <label>
        Due Date
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={updateField}
          min={today}
          aria-invalid={Boolean(fieldErrors.dueDate)}
          required
        />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </label>

      <button ref={createButtonRef} type="submit">Create Task</button>
      {message && <p className="error">{message}</p>}
    </form>
  )

  return (
    <>
      <div ref={pageRef} className="task-page">
        {toast && <div ref={toastRef} className="toast">{toast}</div>}

        <Navbar auth={auth} onLogout={onLogout} />

        <section className="summary-grid">
          <article className="summary-card">
            <span>Total Tasks</span>
            <strong>{taskSummary.total}</strong>
          </article>
          <article className="summary-card">
            <span>To Do</span>
            <strong>{taskSummary.todo}</strong>
          </article>
          <article className="summary-card">
            <span>In Progress</span>
            <strong>{taskSummary.progress}</strong>
          </article>
          <article className="summary-card">
            <span>Completed</span>
            <strong>{taskSummary.completed}</strong>
          </article>
        </section>

        <section className="task-layout">
          {renderCreateForm('desktop-create-form')}

        <section className="task-list-panel">
          <div className="page-header task-list-header">
            <h2>Your Tasks</h2>
          </div>

          <div className="task-tools">
            <input
              placeholder="Search tasks"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              visibleTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div>
                    <span className={`status status-${task.status.toLowerCase()}`}>
                      {statusLabels[task.status]}
                    </span>
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    {task.dueDate && <p>Due: {task.dueDate}</p>}
                  </div>

                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(event) => updateStatus(task, event.target.value)}
                    >
                      <option value="TO_DO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button type="button" onClick={() => editTask(task)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

        {editingTask && (
          <EditTaskPage
            task={editingTask}
            onClose={closeEditModal}
            onSave={saveEdit}
          />
        )}
      </div>

      <button
        type="button"
        className="mobile-create-fab"
        aria-label="Create new task"
        style={
          fabPosition
            ? { left: `${fabPosition.x}px`, top: `${fabPosition.y}px` }
            : undefined
        }
        onPointerDown={startFabDrag}
        onPointerMove={moveFab}
        onPointerUp={stopFabDrag}
        onPointerCancel={stopFabDrag}
        onClick={(event) => {
          if (fabDragRef.current.suppressClick) {
            event.preventDefault()
            fabDragRef.current.suppressClick = false
            return
          }

          openCreateModal()
        }}
      >
        <span>+</span>
      </button>

      {showCreateModal && (
        <div className="modal-backdrop mobile-create-backdrop" role="presentation">
          <section className="modal mobile-create-modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>New Task</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close create task modal"
                onClick={() => setShowCreateModal(false)}
              >
                X
              </button>
            </div>
            {renderCreateForm('modal-form mobile-create-form')}
          </section>
        </div>
      )}
    </>
  )
}

export default TaskPage
