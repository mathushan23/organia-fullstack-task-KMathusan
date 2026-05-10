import { useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar.jsx'

const emptyUserForm = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
}

const emptyTaskForm = {
  userId: '',
  title: '',
  description: '',
  status: 'TO_DO',
  dueDate: '',
}

const today = new Date().toISOString().slice(0, 10)

function AdminPage({ apiUrl, auth, onLogout }) {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${auth.token}`,
    }),
    [auth.token],
  )

  useEffect(() => {
    loadAdminData()
  }, [])

  useEffect(() => {
    if (!message) {
      return
    }

    const timeout = window.setTimeout(() => setMessage(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [message])

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
  }

  const loadAdminData = async () => {
    const [usersResponse, tasksResponse] = await Promise.all([
      fetch(`${apiUrl}/admin/users`, { headers: authHeaders }),
      fetch(`${apiUrl}/admin/tasks`, { headers: authHeaders }),
    ])

    if (usersResponse.ok) {
      setUsers(await usersResponse.json())
    }

    if (tasksResponse.ok) {
      setTasks(await tasksResponse.json())
    }
  }

  const handleError = async (response, fallback) => {
    const error = await response.json().catch(() => null)
    showMessage(error?.message || fallback, 'error')
  }

  const updateUserField = (event) => {
    setUserForm({ ...userForm, [event.target.name]: event.target.value })
  }

  const updateTaskField = (event) => {
    setTaskForm({ ...taskForm, [event.target.name]: event.target.value })
  }

  const saveUser = async (event) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch(
      editingUserId ? `${apiUrl}/admin/users/${editingUserId}` : `${apiUrl}/admin/users`,
      {
        method: editingUserId ? 'PUT' : 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      },
    )

    if (!response.ok) {
      await handleError(response, 'Unable to save user')
      return
    }

    setUserForm(emptyUserForm)
    setEditingUserId(null)
    showMessage(editingUserId ? 'User updated successfully' : 'User created successfully')
    await loadAdminData()
  }

  const editUser = (user) => {
    setEditingUserId(user.id)
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    })
  }

  const deleteUser = async (id) => {
    const response = await fetch(`${apiUrl}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })

    if (!response.ok) {
      await handleError(response, 'Unable to delete user')
      return
    }

    if (selectedUserId === id) {
      setSelectedUserId(null)
    }

    showMessage('User deleted successfully')
    await loadAdminData()
  }

  const saveTask = async (event) => {
    event.preventDefault()
    setMessage('')

    const payload = {
      ...taskForm,
      userId: Number(taskForm.userId),
      dueDate: taskForm.dueDate || null,
    }

    const response = await fetch(
      editingTaskId ? `${apiUrl}/admin/tasks/${editingTaskId}` : `${apiUrl}/admin/tasks`,
      {
        method: editingTaskId ? 'PUT' : 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      await handleError(response, 'Unable to save task')
      return
    }

    setTaskForm(emptyTaskForm)
    setEditingTaskId(null)
    showMessage(editingTaskId ? 'Task updated successfully' : 'Task created successfully')
    await loadAdminData()
  }

  const editTask = (task) => {
    setEditingTaskId(task.id)
    setTaskForm({
      userId: String(task.userId),
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate || '',
    })
  }

  const deleteTask = async (id) => {
    const response = await fetch(`${apiUrl}/admin/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })

    if (!response.ok) {
      await handleError(response, 'Unable to delete task')
      return
    }

    showMessage('Task deleted successfully')
    await loadAdminData()
  }

  const visibleUsers = users.filter((user) => {
    const text = `${user.name} ${user.email} ${user.role}`.toLowerCase()
    return user.role !== 'ADMIN' && text.includes(userSearch.trim().toLowerCase())
  })

  const selectedUser = users.find((user) => user.id === selectedUserId)
  const selectedTasks = selectedUserId
    ? tasks.filter((task) => task.userId === selectedUserId)
    : []

  return (
    <div className="task-page admin-page">
      <Navbar auth={auth} onLogout={onLogout} />

      <section className="summary-grid">
        <article className="summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </article>
        <article className="summary-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </article>
        <article className="summary-card">
          <span>Admins</span>
          <strong>{users.filter((user) => user.role === 'ADMIN').length}</strong>
        </article>
        <article className="summary-card">
          <span>Completed</span>
          <strong>{tasks.filter((task) => task.status === 'COMPLETED').length}</strong>
        </article>
      </section>

      {message && <p className={messageType === 'error' ? 'error' : 'success'}>{message}</p>}

      <section className={selectedUser ? 'admin-layout' : 'admin-layout admin-layout-single'}>
        <section className="task-list-panel">
          <div className="page-header task-list-header">
            <h2>All Users</h2>
            <p>Search users and view their task history</p>
          </div>

          <div className="task-tools admin-search">
            <input
              placeholder="Search users by name, email, or role"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
            />
          </div>

          {editingUserId && (
            <form className="task-form admin-edit-form" onSubmit={saveUser}>
              <div className="page-header">
                <h2>Edit User</h2>
              </div>
              <label>
                Name
                <input name="name" value={userForm.name} onChange={updateUserField} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={userForm.email} onChange={updateUserField} required />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={updateUserField}
                  minLength="8"
                  placeholder="Leave blank to keep current password"
                />
              </label>
              <label>
                Role
                <select name="role" value={userForm.role} onChange={updateUserField} required>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <div className="admin-form-actions">
                <button type="submit">Update User</button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingUserId(null)
                    setUserForm(emptyUserForm)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="task-list">
            {visibleUsers.map((user) => (
              <article className="task-card admin-card" key={user.id}>
                <div>
                  <span className="status status-in_progress">{user.role}</span>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="admin-card-actions">
                  <button type="button" className="compact-button" onClick={() => setSelectedUserId(user.id)}>
                    View Tasks
                  </button>
                  <button type="button" className="compact-button secondary-button" onClick={() => editUser(user)}>
                    Edit
                  </button>
                  <button type="button" className="compact-button danger-button" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {visibleUsers.length === 0 && <p>No users found</p>}
          </div>
        </section>

        {selectedUser && (
          <section className="task-list-panel">
            <div className="page-header task-list-header">
              <h2>{`${selectedUser.name}'s Tasks`}</h2>
              <p>{selectedUser.email}</p>
              <button type="button" className="secondary-button compact-button" onClick={() => setSelectedUserId(null)}>
                Hide Task History
              </button>
            </div>

            {editingTaskId && (
              <form className="task-form admin-edit-form" onSubmit={saveTask}>
                <div className="page-header">
                  <h2>Edit Task</h2>
                </div>
                <label>
                  User
                  <select name="userId" value={taskForm.userId} onChange={updateTaskField} required>
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Title
                  <input name="title" value={taskForm.title} onChange={updateTaskField} maxLength="100" required />
                </label>
                <label>
                  Description
                  <textarea
                    name="description"
                    value={taskForm.description}
                    onChange={updateTaskField}
                    maxLength="500"
                    rows="4"
                  />
                </label>
                <label>
                  Status
                  <select name="status" value={taskForm.status} onChange={updateTaskField} required>
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </label>
                <label>
                  Due Date
                  <input type="date" name="dueDate" value={taskForm.dueDate} onChange={updateTaskField} min={today} required />
                </label>
                <div className="admin-form-actions">
                  <button type="submit">Update Task</button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setEditingTaskId(null)
                      setTaskForm(emptyTaskForm)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="task-list">
              {selectedTasks.length === 0 ? (
                <p>No task history found for this user</p>
              ) : (
                selectedTasks.map((task) => (
                  <article className="task-card admin-card" key={task.id}>
                    <div>
                      <span className={`status status-${task.status.toLowerCase()}`}>{task.status}</span>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <p>Due: {task.dueDate}</p>
                    </div>
                    <div className="admin-card-actions">
                      <button type="button" className="compact-button secondary-button" onClick={() => editTask(task)}>
                        Edit
                      </button>
                      <button type="button" className="compact-button danger-button" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </section>

    </div>
  )
}

export default AdminPage
