# psk-inputsearch

Input Vue component for search and filtering data in an API or a static list.

* Report bugs: https://github.com/pauloklaus/psk-inputsearch/issues
* Live test: https://pauloklaus.com.br/playground

## Install

Create a new vue project:
```
vue create
```

Install component and dependencies:
```
npm install --save bootstrap bootstrap-vue psk-inputsearch
```

## Environment setting

Make a src/resources folder at the root:
```
mkdir src/resources
```

### Configure the bootstrap

Create the src/resources/bootstrap-vue.js:
```
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
```

### Configure the psk-inputsearch

Create the src/resources/psk-inputsearch.js:
```
import Vue from "vue";
import InputSearch from "psk-inputsearch";
import "psk-inputsearch/dist/InputSearch.css";

Vue.use(InputSearch, { InputSearchName: "MyInputSearch" });
```

### Import psk-inputsearch and dependencies

The "src/main.js" file should look like this:
```
import Vue from "vue";
import App from "./App.vue";

import "./resources/bootstrap-vue";
import "./resources/psk-inputsearch";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount("#app");

```

## How to use (example in App.vue)
```
<template>
    <div>
        <p>My Input Search in API
        <br><my-input-search text-field="title" v-model="value" placeholder="Find a product..." :searchMethod="searchInAPI" />
        <br>{{ error }}</p>

        <p>My Input Search in static list
        <br><my-input-search text-field="title" v-model="value" placeholder="Find a person..." :searchMethod="searchInStaticList" /></p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            people: [
                { id: 4, description: "Dennis Ritchie" },
                { id: 3, description: "Grace Hopper" },
                { id: 2, description: "John Backus" },
                { id: 1, description: "John McCarthy" },
                { id: 6, description: "Ken Thompson" },
                { id: 5, description: "Robin Milner" },
            ],
            error: null,
            value: {}
        }
    },
    methods: {
        async searchInApi(term) {
            try {
                const searchResponse = await this.$axios.get("https://fakestoreapi.com/products", { params: { term: term }});
                return Array.isArray(searchResponse.data) ? searchResponse.data : null;
            }
            catch (error) {
                this.$emit("error", error);
            }
            return null;
        },
        searchInStaticList(term) {
            return term ? this.people.filter(item => item.description.toLowerCase().indexOf(term) > -1 ) : this.people;
        }
    }
}
</script>

<style>
* {
    border-radius: 0 !important;
}
input:focus,
button:focus {
    outline: none;
}
</style>
```

## Default JSON format
```
[
    { id: 1, description: "Test 1" },
    { id: 2, description: "Test 2" }
]
```

## Properties

Property | Description | Required | Default
-|-|-|-
searchMethod | Method to start search and return a filtered array. Has a term parameter with the typed text. | yes |
inputId | html id to the input element | no | random id
autofocus | Focus on load page | no | false
disabled | To disable user input | no | false
debouce | Time to start the search when the user stops typing | no | 500
placeholder | Text to display when the input is empty | no | null
description | Explanation of use, displayed discreetly below the input | no | null
idField | JSON id field | no | id
textField | JSON field with description to display in the input when a list item is selected | no | description
customText | Function to customize text to display in the input | no | null
customFormatResult | Function to customize the result object | no | null
value | Value (an object like this { id: 1, descript: "Test 1" }) to bind selection | no | null
showActionButton | Display a button at the end of the input | no | false
actionButtonIcon | Action button icon (from https://bootstrap-vue.org/docs/icons) | no | box-arrow-up-right
buttonVariant | Variant bootstrap color to the button: primary, secondary, success, warning, danger, info, light, dark | no | null
waitingText | Text to display while searching | no | Searching...
notFoundText | Text to display when nothing was found | no | Not found.
containerClass | Class of container div | no | -
resultClass | Class of result div | no | -
messageClass | Class of "searching" message | no | -
itemClass | Class of item | no | -
selectedClass | Class of selected item | no | -

## Events

Event | Description
-|-
change | When there is change
keydown | When a key is pressed
actionButtonClick | When a button is clicked

## Using in the browser

To use directly in the browser, import bootstrap-vue before psk-inputsearch:
```
<script src="https://unpkg.com/vue-boostrap" />
<script src="https://unpkg.com/psk-inputsearch" />
```

## Thanks

For the support, friendship and knowledge they always share!

* Marlon Dauernheimer, https://github.com/DMarlon
* Álisson Bertochi, https://github.com/gnxbr

Marlon was essential to optimize and simplify the source code.
