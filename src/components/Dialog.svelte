<script>
  export let active = false;
</script>

{#if active}
  <div class="overlay">
    <div class="box">
      <span class="close" on:click={() => { active = false }}>
        &times;
      </span>
      <slot>
      </slot>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .box {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    position: relative;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>