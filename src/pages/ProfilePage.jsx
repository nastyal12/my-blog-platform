import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/auth'; // Не забудь добавить этот метод в auth.js

const ProfilePage = ({ user, setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    // Подставляем текущие данные пользователя в поля формы сразу
    defaultValues: {
      username: user.username,
      email: user.email,
      image: user.image,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Если поле пароля пустое — не отправляем его на сервер
      if (!data.password) {
        delete data.password;
      }

      const response = await updateUser(data);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      alert('Profile updated successfully!');
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
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label>Username</label>
          <input {...register('username', { required: 'Required' })} />
          {errors.username && (
            <p className="error-msg">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            {...register('email', { required: 'Required' })}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>New password</label>
          <input
            type="password"
            placeholder="New password"
            {...register('password', { minLength: 6, maxLength: 40 })}
          />
          {errors.password && (
            <p className="error-msg">Password must be 6-40 characters</p>
          )}
        </div>

        <div className="form-group">
          <label>Avatar image (URL)</label>
          <input
            placeholder="Avatar URL"
            {...register('image', { pattern: /^(ftp|http|https):\/\/[^ "]+$/ })}
          />
          {errors.image && <p className="error-msg">Must be a valid URL</p>}
        </div>

        <button type="submit" className="auth-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
