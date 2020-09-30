import { View } from "native-base";
import * as React from "react";
import { SafeAreaView } from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { H1 } from "../../../../../components/core/typography/H1";
import { IOStyles } from "../../../../../components/core/variables/IOStyles";
import BaseScreenComponent from "../../../../../components/screens/BaseScreenComponent";
import I18n from "../../../../../i18n";
import { GlobalState } from "../../../../../store/reducers/types";
import { FooterTwoButtons } from "../../../bonusVacanze/components/markdown/FooterTwoButtons";

export type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

/**
 * This screen informs the user that the provided iban is not right and cannot continue.
 * @constructor
 */
const IbanKoWrong: React.FunctionComponent<Props> = props => (
  <BaseScreenComponent
    goBack={true}
    headerTitle={"Cashback pagamenti digitali"}
  >
    <NavigationEvents onDidFocus={() => console.log("focus cannot verify")} />
    <SafeAreaView style={IOStyles.flex}>
      <View style={IOStyles.flex}>
        <H1>Iban wrong!</H1>
      </View>
      <FooterTwoButtons
        onRight={props.modifyIban}
        onCancel={props.cancel}
        title={I18n.t("global.buttons.continue")}
      />
    </SafeAreaView>
  </BaseScreenComponent>
);

const mapDispatchToProps = (_: Dispatch) => ({
  modifyIban: () => {},
  cancel: () => {}
});

const mapStateToProps = (_: GlobalState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(IbanKoWrong);
