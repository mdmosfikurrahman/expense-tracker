package org.epde.eTracker.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyUtil {

    public static String formatAmount(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
        formatter.setMinimumFractionDigits(2);
        formatter.setMaximumFractionDigits(2);
        return formatter.format(amount) + " BDT";
    }

}
