import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TConstructorIngredient } from '@utils-types';
import { IngredientTypes } from '../../utils/dnd-types';

type TDraggableConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  moveIngredient: (fromIndex: number, toIndex: number) => void;
  children: React.ReactElement;
};

export const DraggableConstructorElement: FC<
  TDraggableConstructorElementProps
> = ({ ingredient, index, moveIngredient, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: IngredientTypes.CONSTRUCTOR_INGREDIENT,
    item: { index, id: ingredient.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: IngredientTypes.CONSTRUCTOR_INGREDIENT,
    hover: (item: { index: number; id: string }) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;
      if (item.id === ingredient.id) return;

      moveIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity, cursor: 'move' }}>
      {children}
    </div>
  );
};
