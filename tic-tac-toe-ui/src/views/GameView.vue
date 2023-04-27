<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue';
import GameActions from '@/components/GameActions.vue';
import GameStatus from '@/components/GameStatus.vue';
import Dialog from '@/components/Dialog.vue';
</script>

<script lang="ts">
export default {
  props: ["uuid"],
  data() {
    return {
      dialogAlert: {
        show: false,
        message: "",
        ok: () => {}
      },
      dialogConfirm: {
        show: false,
        message: "",
        ok: () => {},
        cancel: () => {}
      },
      game: {
        name: "Loading...",
        state: [] as number[],
        status: "created"
      },
      player: {
        sign: "-"
      },
      socket: {} as WebSocket,
    }
  },
  mounted: function() {
    this.connectToGame();
  },
  beforeUnmount() {
    this.socket.close(1000, "game_close");
  },
  methods: {
    giveMove(cell: number) {
      if (this.game.state.indexOf(cell) < 0) {
        this.sendWsData("giveMove", cell);
      }
    },
    connectToGame() {
      this.socket = new WebSocket(`ws://localhost:8000/wss/${this.uuid}`);
      
      this.socket.addEventListener("open", (event) => {
        this.sendWsData("getGameData", null);
      });
      this.socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        this.processWsData(data.command, data.data);
      });
      this.socket.addEventListener("error", (event) => {
        console.log("Error: ", event);
      });
      this.socket.addEventListener("close", (event) => {
        console.log("close: ", event);
        if(event.reason === "no_game") {
          this.showAlert("No game is available with this ID.", () => this.$router.push(`/`));
        }
        else if(event.reason === "no_slot") {
          this.showAlert("No available slot for this game. Please try another one.", () => this.$router.push(`/`));
        }
      });
    },
    sendWsData(command: string, data: any) {
      if (!this.socket.send) return;
      if (!command) command = "default";
      const msg = { command, data };
      this.socket.send(JSON.stringify(msg));
    },
    processWsData(command: string, data: any) {
      switch(command) {
        case "gameState":
          this.game = data.game;
          this.player = data.player;
          console.log(data)
          break;
        case "youWon":
          this.showAlert("You have won the game.", () => { this.dialogAlert.show = false });
          break;
        case "oponentWon":
          this.showAlert("You have failed the game.", () => { this.dialogAlert.show = false });
          break;
        case "requestBack":
          this.showConfirm("Your oponent is requesting for one step back. Do you agree?",
                            () => {
                              this.dialogConfirm.show = false;
                              this.sendWsData("confirmBack", null);
                            },
                            () => {
                              this.dialogConfirm.show = false;
                              this.sendWsData("rejectBack", null);
                            });
          break;
        case "rejectBack":
          this.showAlert("Your oponent rejected the step back request.", () => {this.dialogAlert.show = false});
          break;
        default:
          console.log(command, data);
      }
    },
    requestBack() {
      this.sendWsData("requestBack", null);
    },
    showAlert(msg: string, okAction: any) {
      this.dialogAlert.message = msg;
      this.dialogAlert.show = true;
      this.dialogAlert.ok = okAction;
    },
    showConfirm(msg: string, okAction: any, cancelAction: any) {
      this.dialogConfirm.message = msg;
      this.dialogConfirm.show = true;
      this.dialogConfirm.ok = okAction;
      this.dialogConfirm.cancel = cancelAction;
    }
  }
}
</script>

<template>
  <div>
    <v-card class="cards">
      <v-card-text>
        <h1>Game ongoing: {{ game.name }}</h1>
        <GameStatus :game="game" :player="player"/>
        <GameBoard :state="game.state" @move="$event => giveMove($event)" :status="game.status"/>
        <GameActions :status="game.status" @requestBack="requestBack()"/>

        <Dialog v-model="dialogConfirm.show"
                @ok="dialogConfirm.ok()"
                @cancel="dialogConfirm.cancel()"
                :message="dialogConfirm.message"
                :isConfirm="true"/>
        <Dialog v-model="dialogAlert.show"
                @ok="dialogAlert.ok()"
                :message="dialogAlert.message"
                :isConfirm="false"/>

      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.cards {
  margin: 30px;
  width: 900px;
  height: 900px;
}
</style>
