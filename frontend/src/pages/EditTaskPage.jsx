import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

const today = new Date().toISOString().slice(0, 10)

function EditTaskPage({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate || '',
  })
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const backdropRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    animate(backdropRef.current, {
      opacity: [0, 1],
      duration: 180,
      ease: 'outQuad',
    })

    animate(modalRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      y: [18, 0],
      duration: 300,
      ease: 'outBack',
    })
  }, [])

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setFieldErrors({ ...fieldErrors, [event.target.name]: '' })
  }

  const validateTask = () => {
    const errors = {}

    if (!form.title.trim()) {
      errors.title = 'Title is required'
    }

    if (form.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or less'
    }

    if (form.description.trim().length > 500) {
      errors.description = 'Description must be 500 characters or less'
    }

    if (!form.status) {
      errors.status = 'Status is required'
    }

    if (!form.dueDate) {
      errors.dueDate = 'Due date is required'
    }

    if (form.dueDate && form.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
    }

    return errors
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')

    const validationErrors = validateTask()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setMessage('Please fix the highlighted fields')
      return
    }

    setFieldErrors({})

    const error = await onSave({
      ...form,
      dueDate: form.dueDate || null,
    })

    if (error) {
      setMessage(error)
    }
  }

  return (
    <div ref={backdropRef} className="modal-backdrop" role="presentation">
      <section ref={modalRef} className="modal" role="dialog" aria-modal="true">
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
