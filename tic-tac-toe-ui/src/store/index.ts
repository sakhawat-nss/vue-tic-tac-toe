import { createStore } from 'vuex'
import { UPDATE_GAME_CACHE, GET_LATEST_GAMES_LIST } from './types';

const store = createStore({
  state () {
    return {
      games: []
    }
  },
  mutations: {
    [UPDATE_GAME_CACHE](state, games) {
      state.games = games;
    }
  },
  actions: {
    async [GET_LATEST_GAMES_LIST](context) {
      const res = await fetch("http://localhost:8000/games");
      const data = await res.json();
      this.games = data.data;
      context.commit(UPDATE_GAME_CACHE, data.data);
    }
  }
});

export default store;