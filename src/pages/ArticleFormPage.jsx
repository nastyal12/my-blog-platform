import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createArticle,
  updateArticle,
  getSingleArticle,
} from '../services/api';

const ArticleFormPage = ({ isEdit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (isEdit && slug) {
      getSingleArticle(slug).then(({ article }) => {
        setValue('title', article.title);
        setValue('description', article.description);
        setValue('body', article.body);
        setValue('tagList', article.tagList.join(', '));
      });
    }
  }, [isEdit, slug, setValue]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      tagList: data.tagList
        ? data.tagList.split(',').map((tag) => tag.trim())
        : [],
    };

    try {
      if (isEdit) {
        await updateArticle(slug, formattedData);
      } else {
        await createArticle(formattedData);
      }
      navigate('/articles');
    } catch (err) {
      console.error('Error saving article:', err); // Теперь err используется!
      alert('Ошибка при сохранении статьи');
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form article-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>{isEdit ? 'Edit article' : 'Create new article'}</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Title"
          />
          {errors.title && <p className="error-msg">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label>Short description</label>
          <input
            {...register('description', {
              required: 'Description is required',
            })}
            placeholder="Short description"
          />
          {errors.description && (
            <p className="error-msg">{errors.description.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Text</label>
          <textarea
            {...register('body', { required: 'Body is required' })}
            placeholder="Text"
            rows="6"
          />
          {errors.body && <p className="error-msg">{errors.body.message}</p>}
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input {...register('tagList')} placeholder="Tags" />
        </div>

        <button type="submit" className="auth-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default ArticleFormPage;
