# Providers
<TODO after adding all Providers add summery>

## ModalProvider Component

The ModalProvider component ensures that the modal is only rendered on the client-side. It uses React's `useState` and `useEffect` hooks to track the mounting state of the component. 

- **State Management**: The component maintains an `isMounted` state to determine if it has been mounted.
- **Client-Side Rendering**: 
The useEffect hook sets the `isMounted` state to `true` after the component mounts. If the component is not mounted, it returns `null` to prevent server-side rendering.

- **Rendering**: Once the component is mounted, it renders the `StoreModal` component.

This approach ensures that the modal and other client-side only components are not rendered during server-side rendering, avoiding potential issues with mismatched content.

---
