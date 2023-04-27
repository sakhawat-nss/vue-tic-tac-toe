<script lang="ts">
export default {
    props: {
        value: Boolean,
        message: String,
        isConfirm: Boolean,
    },
    computed: {
        show: {
            get () {
                return this.value;
            },
            set (value: boolean) {
                console.log(value)
                this.$emit('input', value);
            }
        }
    },
    methods: {
        actionOK() {
            this.show = false;
            this.$emit("ok");
        },
        actionCancel() {
            this.show = false;
            this.$emit("cancel");
        }
    }
}
</script>

<template>
    <v-dialog v-model="show" width="auto">
        <v-card>
            <v-card-text>
                {{ message }}
            </v-card-text>
            <v-card-actions class="actions">
                <v-btn color="primary" @click="actionOK()">Ok</v-btn>
                <v-btn color="primary" @click="actionCancel()" v-if="isConfirm">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
