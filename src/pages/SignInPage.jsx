import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';

const SignInPage = ({ setUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Для UI блокировки кнопки
  const [generalError, setGeneralError] = useState(''); // Для общих ошибок сервера

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors, // Функция для очистки ошибок
  } = useForm({
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGeneralError('');
    clearErrors(); // Очищаем старые ошибки перед новой попыткой

    try {
      const response = await loginUser(data);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/articles');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          const isGeneral = key === 'body' || key === 'email or password';

          if (isGeneral) {
            setError('email', {
              type: 'server',
              message: '',
            });
            setError('password', {
              type: 'server',
              message: 'Invalid email or password',
            });
          } else {
            setError(key, {
              type: 'server',
              message: `${key} ${serverErrors[key]}`,
            });
          }
        });
      } else {
        setGeneralError('Server is not responding. Try again later.');
      }
    } finally {
      setIsSubmitting(false); // Разблокируем кнопку в любом случае
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>

        {generalError && (
          <p className="error-msg general-error">{generalError}</p>
        )}

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="Email address"
            className={errors.email ? 'input-error' : ''}
            {...register('email', {
              required: 'Email is required',
              onChange: () => {
                clearErrors('email'); // Чистим ошибку, как только пользователь начал печатать
                setGeneralError('');
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
              onChange: () => {
                clearErrors('password'); // Чистим ошибку при вводе
                setGeneralError('');
              },
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={isSubmitting} // Блокируем кнопку при загрузке
        >
          {isSubmitting ? 'Loading...' : 'Login'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
