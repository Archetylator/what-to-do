<nav>
  <slot name="left">
  </slot>
  
  <slot name="center">
  </slot>

  <slot name="right">
  </slot>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 2rem 2rem;
  }

  nav > :nth-child(1) {
    justify-self : flex-start;
  }

  nav > :nth-child(3) {
    justify-self : flex-end;
    width: 200px;
  }

  @media only screen and (max-width: 750px) {
    nav > :nth-child(3) {
      order: 2;
    }

    nav > :nth-child(2) {
      order: 3;
      margin: 2rem auto 0;
    }
  }
</style>