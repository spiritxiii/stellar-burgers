import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import { removeIngredient, moveIngredient } from '@slices';
import { BurgerConstructorElementUI } from '@ui';
import { DraggableConstructorElement } from './draggable-constructor-element';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMove = (fromIndex: number, toIndex: number) => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        handleMove(index, index + 1);
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        handleMove(index, index - 1);
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <DraggableConstructorElement
        ingredient={ingredient}
        index={index}
        moveIngredient={handleMove}
      >
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
      </DraggableConstructorElement>
    );
  }
);
