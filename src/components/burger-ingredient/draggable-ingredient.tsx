import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { TIngredient } from '@utils-types';
import { IngredientTypes } from '../../utils/dnd-types';

type TDraggableIngredientProps = {
  ingredient: TIngredient;
  children: React.ReactElement;
};

export const DraggableIngredient: FC<TDraggableIngredientProps> = ({
  ingredient,
  children
}) => {
  const [{ isDragging }, drag] = useDrag({
    type:
      ingredient.type === 'bun'
        ? IngredientTypes.BUN
        : IngredientTypes.INGREDIENT,
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={drag} style={{ opacity }}>
      {children}
    </div>
  );
};
