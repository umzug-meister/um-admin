import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateToOrder() {
  const navigate = useNavigate();

  const navigateToOrder = useCallback(
    (id: string | number | undefined) => {
      if (id) {
        navigate(`/edit/${id}`);
      }
    },
    [navigate],
  );

  return navigateToOrder;
}
