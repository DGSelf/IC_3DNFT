import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";

import ICRC7 "mo:icrc7-mo";
import NFT "./nft/collection";

import D "mo:base/Debug";

actor {
  private var NFTCollection : ?NFT.Collection = null;

  private var _init = false;
  public func init() : async () {
    if (_init == false) {
      Cycles.add<system>(100_000_000_000);

      let initclass = await NFT.Collection({
        icrc7_args = null;
        icrc37_args = null;
        icrc3_args = null;
      });

      NFTCollection := ?initclass;
      _init := true;
    };
  };

  func getCollection() : NFT.Collection {
    switch (NFTCollection) {
      case (null) D.trap("Collection isn't initialized");
      case (?collection) return collection;
    };
  };

  public shared ({ caller }) func mintNFT(name : Text, imgData : [Nat8], modelData : [Nat8]) : async [ICRC7.SetNFTResult] {
    var newID = await getCollection().icrc7_total_supply();

    let newNFT : ICRC7.SetNFTItemRequest = {
      token_id = newID;
      metadata = #Array([#Text name, #Bytes imgData, #Bytes modelData]);
      owner = ?{
        owner = caller;
        subaccount = null;
      };
      override = true;
      memo = null;
      created_at_time = null;
    };

    await getCollection().icrcX_mint([newNFT]);
  };

  public func get_tokens(account : ICRC7.Account, prev : ?Nat, take : ?Nat) : async [Nat] {
    await getCollection().icrc7_tokens_of(account, prev, take);
  };

  public func get_tokens_metadata(token_ids : [Nat]) : async [?[(Text, ICRC7.Value)]] {
    await getCollection().icrc7_token_metadata(token_ids);
  };
};
