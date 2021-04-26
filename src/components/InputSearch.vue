<template>
    <div @keydown.home.prevent="goToHome" @keydown.end.prevent="goToEnd" @keydown.up.prevent="browseTo(-1)" @keydown.page-up.prevent="browseTo(-4)" @keydown.down.prevent="browseTo(1)" @keydown.page-down.prevent="browseTo(4)" @keydown.enter.prevent="enterSelect" @keydown.esc.prevent="cancelSearch" >
        <b-input-group>
            <template v-slot:prepend>
                <b-input-group-text><b-icon-search /></b-input-group-text>
            </template>
            <b-form-input :id="internalId" :debounce="debounce" v-model="term" @keydown="keyDown" @keydown.f2="emitButtonClick" :placeholder="placeholder" :autofocus="autofocus" :disabled="disabled" autocomplete="off" />
            <b-input-group-append>
                <b-button @click.stop="emitButtonClick" v-if="showActionButton" :disabled="!value || value.id == 0" :variant="buttonVariant"><b-icon :icon="actionButtonIcon" /></b-button>
            </b-input-group-append>
        </b-input-group>
        <small v-if="description" class="form-text text-muted mb-3">{{ description }}</small>
        <div :class="containerClass" v-if="(items && items.length) || message">
            <div :class="resultClass">
                <div v-if="message" :class="messageClass">{{ message }}</div>
                <button v-else v-for="(item, index) in items" v-bind:key="index" :ref="'psk-inputsearch-item-' + index" @click="clickSelect(item)" @focus="updateSelectedItem(index)" :class="index == selectedItem ? selectedClass : itemClass">{{ getLabel(item) }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        searchMethod: {
            type: Function,
            required: true
        },
        inputId: {
            type: String,
            default: ""
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        debounce: {
            type: Number,
            default: 500
        },
        placeholder: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        idField: {
            type: String,
            default: "id"
        },
        textField: {
            type: String,
            default: "description"
        },
        customText: {
            type: Function,
            default: null
        },
        customFormatResult: {
            type: Function,
            default: null
        },
        value: {
            default: null
        },
        showActionButton: {
            type: Boolean,
            default: false
        },
        actionButtonIcon: {
            type: String,
            default: "box-arrow-up-right"
        },
        buttonVariant: {
            type: String,
            default: ""
        },
        waitingText: {
            type: String,
            default: "Searching..."
        },
        notFoundText: {
            type: String,
            default: "Not found."
        },
        containerClass: {
            type: String,
            default: "inputsearch-container"
        },
        resultClass: {
            type: String,
            default: "inputsearch-result"
        },
        messageClass: {
            type: String,
            default: "inputsearch-message"
        },
        itemClass: {
            type: String,
            default: "inputsearch-item"
        },
        selectedClass: {
            type: String,
            default: "inputsearch-selected"
        }
    },
    data() {
        return {
            message: "",
            term: "",
            items: null,
            selectedItem: 0,
            selectedValue: null,
            internalId: this.inputId ? this.inputId : "inputsearch-" + Math.random().toString(36).substr(2, 5)
        }
    },
    watch: {
        value(value) {
            this.updateTerm(value);
        },
        async term(newTerm) {
            if (!newTerm) {
                this.items = null;
                this.emitNewTerm();
                return;
            }

            if (this.selectedValue != null && this.getLabel(this.selectedValue) == newTerm)
                return;

            this.emitNewTerm();

            this.message = this.waitingText;
            this.items = await this.searchMethod(newTerm);
            this.selectedItem = 0;

            if (this.items && this.items.length)
                this.message = "";
            else {
                this.message = this.notFoundText;

                setTimeout(() => {
                    this.message = "";
                }, 1000);
            }
        }
    },
    created() {
        this.updateTerm(this.value);
    },
    mounted() {
        document.addEventListener("click", this.stopSearch);
        document.addEventListener("keyup", this.stopSearch);
    },
    destroyed() {
        document.removeEventListener("click", this.stopSearch);
        document.removeEventListener("keyup", this.stopSearch);
    },
    methods: {
        focusOn(element) {
            this.$nextTick(() => {
                const target = document.getElementById(element);
                if (target)
                    target.focus();
            });
        },
        updateTerm(value) {
            this.selectedValue = value;
            if (this.selectedValue != null)
                this.term = this.getLabel(this.selectedValue);
        },
        getId(item) {
            return item[this.idField];
        },
        getLabel(item) {
            return this.customText ? this.customText(item) : item[this.textField];
        },
        hideItems() {
            this.items = null;

            if (this.selectedValue == null)
                this.term = "";
        },
        cancelSearch() {
            this.hideItems();
            this.focusOn(this.internalId);
        },
        stopSearch(event) {
            if (!this.$el.contains(event.target))
                this.hideItems();
        },
        emitNewTerm(value) {
            this.selectedValue = value;
            this.$emit("input", this.customFormatResult ? this.customFormatResult(value) : value);
            this.$emit("change");
        },
        clickSelect(value) {
            this.items = null;
            this.updateTerm(value);
            this.emitNewTerm(this.selectedValue);
            this.focusOn(this.internalId);
        },
        scrollToItem() {
            const item = this.$refs["psk-inputsearch-item-" + this.selectedItem];
            if (item.length)
                item[0].focus();
        },
        hasItems() {
            return this.items && this.items.length;
        },
        browseTo(position) {
            if (!this.hasItems())
                return;

            var newPosition = this.selectedItem + position;

            if (newPosition < 0)
                newPosition = 0;
            else if (newPosition > this.items.length - 1)
                newPosition = this.items.length - 1;

            if (this.selectedItem != newPosition) {
                this.selectedItem = newPosition;
                this.scrollToItem();
            }
        },
        goToHome() {
            if (this.hasItems()) {
                this.selectedItem = 0;
                this.scrollToItem();
            }
        },
        goToEnd() {
            if (this.hasItems()) {
                this.selectedItem = this.items.length - 1;
                this.scrollToItem();
            }
        },
        updateSelectedItem(index) {
            this.selectedItem = index;
        },
        enterSelect() {
            if (this.items)
                this.clickSelect(this.items[this.selectedItem]);
        },
        keyDown(event) {
            this.$emit("keydown", event);
        },
        emitButtonClick() {
            this.$emit("actionButtonClick");
        }
    }
}
</script>

<style scoped>
.inputsearch-container {
    position: relative;
    z-index: 100;
}
.inputsearch-result {
    background-color: var(--light);
    border: 1px solid var(--gray);
    margin: 4px 0 0 0;
    padding: 4px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    max-height: 180px;
    min-width: 200px;
    width: 100%;
}
.inputsearch-message {
    color: var(--secondary);
    padding: 0 5px;
    text-align: center;
}
.inputsearch-item,
.inputsearch-selected {
    background-color: var(--light);
    border: 0;
    cursor: pointer;
    padding: 4px 8px;
    text-align: left;
    width: 100%;
}
.inputsearch-item:hover {
    background-color: var(--secondary);
    color: var(--light);
}
.inputsearch-selected {
    background-color: var(--primary);
    color: var(--light);
}
</style>
