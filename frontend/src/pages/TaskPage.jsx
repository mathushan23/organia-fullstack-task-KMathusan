import { useEffect, useMemo, useState } from 'react'
import EditTaskPage from './EditTaskPage.jsx'

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
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${auth.token}`,
    }),
    [auth.token],
  )

  useEffect(() => {
    loadTasks()
  }, [statusFilter])

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
  }

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2500)
  }

  const validateTask = (taskForm) => {
    if (!taskForm.title.trim()) {
      return 'Title is required'
    }

    if (taskForm.title.trim().length > 100) {
      return 'Title must be 100 characters or less'
    }

    if (taskForm.description.trim().length > 500) {
      return 'Description must be 500 characters or less'
    }

    if (taskForm.dueDate && taskForm.dueDate < today) {
      return 'Due date cannot be in the past'
    }

    return ''
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')

    const validationMessage = validateTask(form)
    if (validationMessage) {
      setMessage(validationMessage)
      return
    }

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

  return (
    <div className="task-page">
      {toast && <div className="toast">{toast}</div>}

      <header className="app-header">
        <div>
          <p className="eyebrow">{auth.role}</p>
          <h1>Task Management</h1>
          <p>{auth.email}</p>
        </div>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="task-layout">
        <form className="task-form" onSubmit={submit}>
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
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength="500"
              rows="4"
            />
            <span className="field-hint">
              {form.description.length}/500 characters
            </span>
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={updateField}>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>

          <label>
            Due Date
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={updateField}
              min={today}
            />
          </label>

          <button type="submit">Create Task</button>
          {message && <p className="error">{message}</p>}
        </form>

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
  )
}

export default TaskPage
