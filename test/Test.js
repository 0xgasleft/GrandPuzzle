
const assert = require("assert");
const { TestHelpers } = require("generated");
const { MockDb, GrandPuzzlePiece } = TestHelpers;

describe("GrandPuzzlePiece contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for GrandPuzzlePiece contract Approval event
  const event = GrandPuzzlePiece.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("GrandPuzzlePiece_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await GrandPuzzlePiece.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualGrandPuzzlePieceApproval = mockDbUpdated.entities.GrandPuzzlePiece_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedGrandPuzzlePieceApproval = {
      id:`${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      approved: event.params.approved,
      tokenId: event.params.tokenId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualGrandPuzzlePieceApproval,
      expectedGrandPuzzlePieceApproval,
      "Actual GrandPuzzlePieceApproval should be the same as the expectedGrandPuzzlePieceApproval"
    );
  });
});
