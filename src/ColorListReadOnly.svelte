<script>
    import chroma from 'chroma-js';
    import Color from './Color.svelte';

    export let colors;
</script>

<style>
    div.form-control {
        height: auto;
    }
    span.inv {
        display: inline-block;
        width: 60px;
        background: white;
        height: 100%;
        vertical-align: bottom;
    }
</style>

<div class="form-control">
    {#each colors as color,i}
    <Color bind:value={color} readOnly={true} />
    {/each}
    <span class="inv"></span>
</div>