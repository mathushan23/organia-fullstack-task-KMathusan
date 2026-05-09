import { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

function EditTaskPage({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate || '',
  })
  const [message, setMessage] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const validateTask = () => {
    if (!form.title.trim()) {
      return 'Title is required'
    }

    if (form.title.trim().length > 100) {
      return 'Title must be 100 characters or less'
    }

    if (form.description.trim().length > 500) {
      return 'Description must be 500 characters or less'
    }

    if (form.dueDate && form.dueDate < today) {
      return 'Due date cannot be in the past'
    }

    return ''
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')

    const validationMessage = validateTask()
    if (validationMessage) {
      setMessage(validationMessage)
      return
    }

    const error = await onSave({
      ...form,
      dueDate: form.dueDate || null,
    })

    if (error) {
      setMessage(error)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close edit task modal"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <form className="task-form modal-form" onSubmit={submit}>
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

          <div className="modal-actions">
            <button type="submit">Update Task</button>
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
          </div>

          {message && <p className="error">{message}</p>}
        </form>
      </section>
    </div>
  )
}

export default EditTaskPage
