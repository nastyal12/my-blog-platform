import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';

const SignUpPage = ({ setUser }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm({ mode: 'onBlur' });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Убираем лишние поля (согласие и повтор пароля) перед отправкой на сервер
      const { username, email, password } = data;
      const response = await registerUser({ username, email, password });

      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/articles');
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
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
        <h2>Create new account</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            placeholder="Username"
            className={errors.username ? 'input-error' : ''}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 20, message: 'Maximum 20 characters' },
            })}
          />
          {errors.username && (
            <p className="error-msg">{errors.username.message}</p>
          )}
        </div>

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
              minLength: { value: 6, message: 'Minimum 6 characters' },
              maxLength: { value: 40, message: 'Maximum 40 characters' },
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Repeat Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === getValues('password') || 'The passwords do not match', // Используем getValues
            })}
            placeholder="Repeat Password"
          />
          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword.message}</p>
          )}
        </div>

        <hr />

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="agree"
            {...register('agree', {
              required: 'You must agree to the processing of data',
            })}
          />
          <label htmlFor="agree">
            I agree to the processing of my personal information
          </label>
          {errors.agree && <p className="error-msg">{errors.agree.message}</p>}
        </div>

        <button type="submit" className="auth-btn">
          Create
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
