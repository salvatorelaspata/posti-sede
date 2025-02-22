import { StyleSheet, View, ViewProps } from "react-native";

// create a component that will be used in the app
// the component accepts a children componente into the tag

export type HeaderImageProps = ViewProps & {};

export function HeaderImage({ style, ...otherProps }: HeaderImageProps) {
  return <View style={[{}, styles.container]} {...otherProps} />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
});
