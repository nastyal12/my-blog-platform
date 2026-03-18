import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/api';
import { useEffect } from 'react';

const SettingsPage = ({ user, setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      image: user?.image || '',
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        image: user.image || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const cleanData = {
        username: data.username.trim(),
        email: data.email.trim(),
        bio: data.bio ? data.bio.trim() : '',
        image: data.image || '',
      };

      if (data.password && data.password.trim() !== '') {
        cleanData.password = data.password;
      }

      const response = await updateProfile(cleanData);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      alert('Profile updated successfully!');
      navigate('/profile');
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
    <div className="auth-container" style={{ padding: '40px 0' }}>
      <form
        className="auth-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: '600px' }}
      >
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
          Edit Profile
        </h2>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
          >
            Username
          </label>
          <input
            className="form-control"
            {...register('username', { required: 'Required' })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
          {errors.username && (
            <p className="error-msg">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
          >
            Email address
          </label>
          <input
            className="form-control"
            type="email"
            {...register('email', { required: 'Required' })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label>Short bio about you</label>
          <textarea
            className="form-control"
            rows="6"
            placeholder="Write something about yourself"
            {...register('bio')} // Регистрируем поле в react-hook-form
          ></textarea>
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
          >
            New password
          </label>
          <input
            className="form-control"
            type="password"
            placeholder="New password"
            {...register('password', {
              minLength: { value: 6, message: 'Min 6 chars' },
            })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
          >
            Avatar image (URL)
          </label>
          <input
            className="form-control"
            placeholder="Avatar URL"
            {...register('image')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>

        <button
          type="submit"
          className="auth-btn"
          style={{ padding: '15px', fontSize: '1.1rem' }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
