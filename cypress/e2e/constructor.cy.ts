const API_URL = Cypress.env('burgerApiUrl');

describe('Конструктор бургера', () => {
  beforeEach(() => {
    window.localStorage.setItem('accessToken', 'test-access-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${API_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', `${API_URL}/orders`, {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients', { timeout: 10000 });
  });

  afterEach(() => {
    window.localStorage.removeItem('accessToken');
    cy.clearCookie('accessToken');
  });

  describe('Тестируем взаимодействие с ингридиентами', () => {
    it('Добавляем булку и ингридиенты', () => {
      cy.get('[data-cy=ingredient-bun]').first().as('bun');
      cy.get('[data-cy=ingredient-main]').first().as('mainIngredient');
      cy.get('[data-cy=ingredient-sauce]').first().as('sauceIngredient');
      cy.get('[data-cy=constructor-bun-top]').as('bunTop');
      cy.get('[data-cy=constructor-main]').as('constructorMain');

      cy.get('@bun').trigger('dragstart');
      cy.get('@bunTop').trigger('drop');
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get('@constructorMain').trigger('drop');
      cy.get('@sauceIngredient').trigger('dragstart');
      cy.get('@constructorMain').trigger('drop');

      cy.get('[data-cy=constructor-bun-top]').as('bunTop');
      cy.get('@bunTop').should('contain', 'Краторная булка N-200i');
      cy.get('@constructorMain').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get('@constructorMain').should('contain', 'Соус Spicy-X');
    });

    it('Открываем и закрываем модальное окно с информацией об ингридиенте', () => {
      cy.get('[data-cy=ingredient-bun]').first().click();

      cy.get('[data-cy=modal]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').should('contain', 'Краторная булка N-200i');

      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('Проверяем клик по оверлею', () => {
      cy.get('[data-cy=ingredient-bun]').first().click();

      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('Тестируем заказ бургера', () => {
      cy.get('[data-cy=ingredient-bun]').first().as('bun');
      cy.get('[data-cy=ingredient-main]').first().as('mainIngredient');
      cy.get('[data-cy=ingredient-sauce]').first().as('sauceIngredient');
      cy.get('[data-cy=constructor-bun-top]').as('bunTop');
      cy.get('[data-cy=constructor-main]').as('constructorMain');

      cy.get('@bun').trigger('dragstart');
      cy.get('@bunTop').trigger('drop');
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get('@constructorMain').trigger('drop');
      cy.get('@sauceIngredient').trigger('dragstart');
      cy.get('@constructorMain').trigger('drop');

      cy.get('[data-cy=order-button]').click();
      cy.get('[data-cy=modal]').as('modal');

      cy.get('@modal').should('be.visible');
      cy.get('[data-cy=order-number]').should('contain', '12345');

      cy.get('[data-cy=modal-close]').click();
      cy.get('@modal').should('not.exist');

      cy.get('[data-cy=constructor-bun-top]').should(
        'contain',
        'Выберите булки'
      );
      cy.get('[data-cy=constructor-main]').should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
