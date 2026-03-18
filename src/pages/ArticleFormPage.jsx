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
        // Заполняем теги, чтобы они были видны в форме, если нужно
        if (article.tagList) {
          setValue('tagList', article.tagList.join(', '));
        }
      });
    }
  }, [isEdit, slug, setValue]);

  const onSubmit = async (data) => {
    // 1. Создаем базовый объект БЕЗ тегов
    const articlePayload = {
      title: data.title,
      description: data.description,
      body: data.body,
    };

    // 2. Если это создание НОВОЙ статьи, добавляем теги
    if (!isEdit) {
      articlePayload.tagList = data.tagList
        ? data.tagList
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '')
        : [];
    }

    try {
      if (isEdit) {
        // При обновлении отправляем объект без ключа tagList
        await updateArticle(slug, { article: articlePayload });
      } else {
        // При создании отправляем полный объект
        await createArticle({ article: articlePayload });
      }
      navigate('/articles');
    } catch (err) {
      console.error(
        'Ошибка при сохранении:',
        err.response?.data || err.message,
      );
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

        {/* 3. СКРЫВАЕМ поле тегов, если мы в режиме редактирования */}
        {!isEdit && (
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input {...register('tagList')} placeholder="Tags" />
          </div>
        )}

        <button type="submit" className="auth-btn">
          {isEdit ? 'Save Changes' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ArticleFormPage;
