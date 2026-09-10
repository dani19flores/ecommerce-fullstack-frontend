import { isAxiosError } from 'axios'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

// El backend devuelve errores por campo, ej: { "password2": ["Passwords do
// not match."], "email": ["Email already exists."] }. Los aplanamos a una
// lista de strings para mostrarlos todos.
function extractErrorMessages(data: unknown): string[] {
  if (!data || typeof data !== 'object') return ['Ocurrió un error al registrarte.']
  return Object.values(data as Record<string, unknown>).flatMap((value) =>
    Array.isArray(value) ? value.map(String) : [String(value)],
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setErrors(extractErrorMessages(err.response.data))
      } else {
        setErrors(['Ocurrió un error al registrarte.'])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-center text-2xl font-semibold text-gray-900">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            id="username"
            value={form.username}
            onChange={handleChange('username')}
            required
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            required
            minLength={8}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password2" className="text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            id="password2"
            type="password"
            value={form.password2}
            onChange={handleChange('password2')}
            required
            minLength={8}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        {errors.length > 0 && (
          <ul className="text-sm text-red-600">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-gray-900 px-3 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-gray-900 underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  )
}
