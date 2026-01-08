<template>
    <div>
        <v-overlay :value="show" :opacity="0.3" :z-index="999999">
        </v-overlay>
    </div>
</template>

<script>

export default {
    name: "OverlayComponent",
    props: ['show']
}

</script>