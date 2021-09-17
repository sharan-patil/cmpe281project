import { useSelector } from 'react-redux';
import { hookFormPersistSelector } from '../hooks/useHookFormPersist/hookFormPersistSlice';
import { taskTypeSelector } from '../taskTypeSlice';

export const useIsTaskType = (task_translation_key) => {
  const persistedFormData = useSelector(hookFormPersistSelector);
  const taskType = useSelector(taskTypeSelector(persistedFormData.task_type_id));
  return !taskType?.farm_id && taskType?.task_translation_key === task_translation_key;
};
