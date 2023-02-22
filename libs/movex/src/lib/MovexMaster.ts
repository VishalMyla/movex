import { AsyncResult } from 'ts-async-results';
import {
  ActionOrActionTuple,
  ActionsCollectionMapBase,
  CheckedState,
  MovexReducerMap,
  MovexState,
} from './types';
import { computeCheckedState, getReducerApplicator, isAction } from './util';
import { getNextStateFrom, NextStateGetter, StringKeys } from 'movex-core-util';

type AsyncStore<TState extends MovexState> = {
  get: (id: string) => AsyncResult<TState, unknown>;
  update: (
    id: string,
    next: NextStateGetter<TState>
  ) => AsyncResult<TState, unknown>;
  remove: (id: string) => AsyncResult<void, unknown>;
};

export class MovexMaster<
  TState extends MovexState,
  ActionsCollectionMap extends ActionsCollectionMapBase,
  TReducerMap extends MovexReducerMap<
    TState,
    ActionsCollectionMap
  > = MovexReducerMap<TState, ActionsCollectionMap>
> {
  private reducerApplicator = getReducerApplicator<
    TState,
    ActionsCollectionMap
  >(this.reducerMap);

  constructor(
    private reducerMap: TReducerMap,
    private store: AsyncStore<TState>
  ) {}

  /**
   * The diffence between this and the dispatch is that this happens in sync and returns the next state,
   * while dispatch() MIGHT not happen in sync and doesn't return
   *
   * @param actionOrActionTuple
   * @returns
   */
  applyAction<TActionType extends StringKeys<ActionsCollectionMap>>(
    id: string,
    actionOrActionTuple: ActionOrActionTuple<TActionType, ActionsCollectionMap>
  ) {
    const nextCheckedState =
      this.getNextCheckedStateFromAction(actionOrActionTuple);

    // this.$checkedState.update(nextCheckedState);

    // this.store.get();

    return nextCheckedState;
  }

  private getNextCheckedStateFromAction<
    TActionType extends StringKeys<ActionsCollectionMap>
  >(
    actionOrActionTuple: ActionOrActionTuple<TActionType, ActionsCollectionMap>
  ) {
    // Always apply the local action (which is the action of the private action in case of a tuple)
    const localAction = isAction(actionOrActionTuple)
      ? actionOrActionTuple
      : actionOrActionTuple[0];

    // const nextState = this.reducerApplicator(
    //   this.getUncheckedState(),
    //   localAction
    // );

    // return computeCheckedState(nextState);
  }

  getUncheckedState() {
    // return this.$checkedState.get()[0];
  }

  update(nextStateGetter: NextStateGetter<CheckedState<TState>>) {
    // this.$checkedState.update(getNextStateFrom(this.get(), nextStateGetter));

    return this;
  }

  updateUncheckedState(nextStateGetter: NextStateGetter<TState>) {
    // return this.update(
    //   computeCheckedState(
    //     getNextStateFrom(this.getUncheckedState(), nextStateGetter)
    //   )
    // );
  }

  // This to be called when destroying not used anymore in order to clean the update subscriptions
  destroy() {
    // this.unsubscribers.forEach(invoke);
  }
}
