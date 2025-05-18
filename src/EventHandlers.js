/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
const {
 GrandPuzzlePiece,
} = require("generated");

GrandPuzzlePiece.Approval.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.GrandPuzzlePiece_Approval.set(entity);
});


GrandPuzzlePiece.ApprovalForAll.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.GrandPuzzlePiece_ApprovalForAll.set(entity);
});


GrandPuzzlePiece.BaseURIUpdated.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _baseTokenURI: event.params._baseTokenURI,
  };

  context.GrandPuzzlePiece_BaseURIUpdated.set(entity);
});


GrandPuzzlePiece.FinishedMission.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _recipient: event.params._recipient,
    _mission_symbol: event.params._mission_symbol,
  };

  context.GrandPuzzlePiece_FinishedMission.set(entity);
});


GrandPuzzlePiece.MintFeeUpdated.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _new_fee: event.params._new_fee,
  };

  context.GrandPuzzlePiece_MintFeeUpdated.set(entity);
});


GrandPuzzlePiece.OwnershipTransferred.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.GrandPuzzlePiece_OwnershipTransferred.set(entity);
});


GrandPuzzlePiece.StatusUpdated.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _status: event.params._status,
  };

  context.GrandPuzzlePiece_StatusUpdated.set(entity);
});


GrandPuzzlePiece.Transfer.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.GrandPuzzlePiece_Transfer.set(entity);
});


GrandPuzzlePiece.WhitelistUpdated.handler(async ({event, context}) => {
  const entity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  };

  context.GrandPuzzlePiece_WhitelistUpdated.set(entity);
});

