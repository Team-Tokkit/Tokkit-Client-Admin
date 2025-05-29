describe("바우처 리스트에서 마지막 바우처 삭제", () => {
  it("마지막 페이지의 마지막 바우처를 삭제", () => {
    cy.visit("http://localhost:3000/voucher");
    cy.url().should("include", "/voucher");

    cy.get('[data-cy="pagination-last"]').click();
    cy.wait(1000);

    cy.get("table tbody tr").last().within(() => {
      cy.get('button:has(svg)').click();
    });

    cy.contains("삭제").click();

cy.get('[data-cy="confirm-delete-button"]').should("be.visible").click();

    cy.on("window:alert", (text) => {
      expect(text).to.include("삭제가 완료되었습니다");
    });

    cy.get("table tbody tr").should("have.length.lessThan", 10);
  });
});
