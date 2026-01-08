<template>
    <div>
        <v-overlay :value="show" :opacity="0.3" :z-index="999999">
            <v-progress-circular color="black" indeterminate :size="70" :width="10" bordered>
            </v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>

export default {
    name: "LoadingComponent",
    props: ['show']
}

</script>