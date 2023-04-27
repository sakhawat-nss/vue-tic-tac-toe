<script lang="ts">
export default {
    props: ["state", "status"],
    methods: {
        getMovePlayerSign(row: number, col: number) {
            const boxLoc = (row - 1) * 3 + (col - 1);
            const index = this.state.indexOf(boxLoc);
            if(index >= 0) {
                return (index % 2? "O": "X");
            }
            else {
                return " ";
            }
        }
    }
}
</script>

<template>
    <div class="m-5">
        <v-card class="cards">
            <v-card-text class="fill-height">
                <table :class="{ pointernone: (status !== 'running')}">
                    <tr v-for="m in 3" :key="m">
                        <td v-for="n in 3" :key="n" class="cell"
                                :style="{ height: (100/3)+'px', width: (100/3)+'px'}"
                                @click="$event => $emit('move', (m - 1) * 3 + (n - 1))"
                                >
                                {{ getMovePlayerSign(m, n) }}
                        </td>
                    </tr>
                </table>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
.cards {
    margin: auto;
    width: 400px;
    height: 400px;
}
.m-5 {
    margin: 20px;
}

.pointernone {
    pointer-events: none;
}

td {
	border: 2px solid #333;
	text-align: center;
	vertical-align: middle;
	font-family: "Comic Sans MS", cursive, sans-serif;
	font-size: 3em;
	cursor: pointer;
}

td:hover {
    background-color: #cecece;
}

table {
	border-collapse: collapse;
	height: 100%;
	width: 100%;
}

table tr:first-child td {
	border-top: 0;
}
table tr:last-child td {
	border-bottom: 0;
}
table tr td:first-child {
	border-left: 0;
}
table tr td:last-child {
	border-right: 0;
}

</style>
