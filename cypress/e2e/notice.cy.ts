describe("공지사항 페이지 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/notice");
  });

  it("상태 변경 → 상세 보기 → 수정 → 새 등록까지", () => {
    cy.get("[data-cy=notice-status-badge]").first().click({ force: true });

    cy.on("window:confirm", (text) => {
      expect(text).to.include("상태를 변경하시겠습니까?");
      return true;
    });

cy.get("[data-cy=notice-more-button]").first().click({ force: true });
    cy.contains("상세보기").click();

    cy.get("[data-cy=edit-button]").click();

    cy.get("[data-cy=notice-title-input]")
      .clear()
      .type("바우처 제목 test");
    cy.get("[data-cy=notice-content-input]")
      .clear()
      .type("최종 발표일 D-14");

    cy.get("[data-cy=notice-save-button]").click();

    cy.get("[data-cy=new-notice-button]").click();

    cy.get("[data-cy=notice-title-input]").type("test");
    cy.get("[data-cy=notice-content-input]").type(".test");

    cy.get("[data-cy=notice-save-button]").click();
  });
});
