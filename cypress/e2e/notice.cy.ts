describe("공지사항 페이지 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/notice");
  });

  it("상태 변경 → 상세 보기 → 수정 → 마지막 페이지 첫 항목 삭제", () => {
    // 상태 변경
    cy.get("[data-cy=notice-status-badge]").first().click({ force: true });

    cy.on("window:confirm", (text) => {
      expect(text).to.include("상태를 변경하시겠습니까?");
      return true;
    });

    cy.contains("공지사항 관리");

    // 상세 보기 및 수정
    cy.get("[data-cy=notice-more-button]").first().click({ force: true });
    cy.get("[data-cy=notice-view-button]").filter(":visible").first().click();

    cy.get("[data-cy=edit-button]").click();
    cy.get("[data-cy=edit-title-input]").clear().type("바우처 제목 test");
    cy.get("[data-cy=edit-content-input]").clear().type("최종 발표일 D-14");
    cy.get("[data-cy=save-edit-button]").click();

    // // 새 공지사항 등록
    cy.get("[data-cy=new-notice-button]").click();
    cy.get("[data-cy=edit-title-input]").type("test");
    cy.get("[data-cy=edit-content-input]").type(".test");
    cy.get("[data-cy=save-edit-button]").click();

    cy.get("[data-cy=pagination-last]").click();

    cy.pause();

    cy.get("[data-cy=notice-delete-button]")
      .filter(":visible")
      .first()
      .click({ force: true });

    cy.get("[data-cy=confirm-delete-button]", { timeout: 5000 }).should("be.visible");
    cy.get("[data-cy=confirm-delete-button]").click();

  });
});
