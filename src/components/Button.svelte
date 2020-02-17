<script>
  import Icon from './Icon.svelte';
  
  export let label;
  export let icon;
  export let look;
</script>

<div on:click class="container {look}">
  <span><slot></slot></span>
</div>

<style type="text/scss">
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.8rem 1.2rem;
    border: 1px solid #eee;
    background: #ECECEC;
    color: #828181;
    border-radius: 0.3rem;
    margin: 0;
    height: 25px;
    font-size: 1.4rem;

    &:active {
      transform: translateY(2px);
    }

    &:hover {
      filter: brightness(103%);
    }
  }

  .transparent {
    background:transparent;
    border: 0;
  }

  .icon {
    fill: #828181;
  }

  .label {
    font-size: 1.3rem;
    margin: 0.3rem 0 0 0.5rem;
  }
</style>