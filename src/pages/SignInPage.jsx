import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth'; // создадим этот метод ниже

const SignInPage = ({ setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      // Сохраняем в localStorage, чтобы сессия не пропадала
      localStorage.setItem('user', JSON.stringify(response.user));
      // Обновляем состояние в App.jsx
      setUser(response.user);
      // Уходим на главную
      navigate('/articles');
    } catch (err) {
      // Если сервер вернул ошибку (например, 422), выводим её
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setError(key === 'email or password' ? 'email' : key, {
            type: 'server',
            message: `${key} ${serverErrors[key]}`,
          });
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="Email address"
            className={errors.email ? 'input-error' : ''}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            className={errors.password ? 'input-error' : ''}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="auth-btn">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
