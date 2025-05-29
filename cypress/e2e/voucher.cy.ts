describe("바우처 수정 테스트 (로그인 없이 바로 진입)", () => {
  it("첫 번째 바우처 수정 후 저장 확인", () => {
    cy.visit("http://localhost:3000/voucher");
    cy.url().should("include", "/voucher");

    cy.get("table tbody tr").first().within(() => {
      cy.get('button:has(svg)').click(); 
    });

    cy.contains("수정").click();

    cy.get('[data-cy="update-description"]').clear().type("시그니엘 서울 프리미어 더블룸 1박 숙박권");
    cy.get('[data-cy="update-detail-description"]').clear().type(
      "프리미어 더블룸 1박 + 조식 2인 포함\n체크인 15:00 / 체크아웃 11:00\n예약 필수, 성수기 사용 불가"
    );
    cy.get('[data-cy="update-price"]').clear().type("320000");
    cy.get('[data-cy="update-contact"]').clear().type("롯데월드");

    cy.get('[data-cy="update-submit-button"]').click();

    cy.get("table tbody tr")
      .contains("td", /^1$/) 
      .parent("tr")
      .within(() => {
        cy.get("button").first().click(); 
      });

    cy.get('[data-cy="view-all-stores"]').click();
    cy.contains("사용처 전체보기").should("be.visible");

    cy.get('div[class^="fixed inset-0"]').first().click({ force: true }); 
    cy.wait(300); 
    cy.get('div[class^="fixed inset-0"]').first().click({ force: true }); 

    cy.get('[data-cy="voucher-create-button"]').click();

    cy.url().should("include", "/voucher/create");

    cy.get('[data-cy="create-name"]').type("한정판 프리미엄 숙박권");
    cy.get('[data-cy="create-description"]').type("시그니엘 서울 숙박 바우처");
    cy.get('[data-cy="create-category"]').click();
    cy.contains("숙박").click();
    cy.get('[data-cy="create-original-price"]').type("700000");
    cy.get('[data-cy="create-price"]').type("500000");
    cy.get('[data-cy="create-total-count"]').type("100");

    cy.pause(); 

    cy.get('[data-cy="create-detail-description"]').type(
      "프리미어 더블룸 2박 + 조식 2인 포함\n체크인 15:00 / 체크아웃 11:00\n예약 필수, 성수기 사용 불가"
    );
    cy.get('[data-cy="create-refund-policy"]').type("유효기간 전까지 100% 환불 가능");
    cy.get('[data-cy="create-contact"]').type("02-123-4567");

    cy.pause(); 

    cy.get('[data-cy="voucher-submit-button"]').click();
    
  });
});