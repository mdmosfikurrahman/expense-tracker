package org.epde.eTracker.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Converter(autoApply = true)
public class YearMonthConverter implements AttributeConverter<YearMonth, String> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    @Override
    public String convertToDatabaseColumn(YearMonth attribute) {
        return attribute != null ? attribute.format(FORMATTER) : null;
    }

    @Override
    public YearMonth convertToEntityAttribute(String dbData) {
        return dbData != null ? YearMonth.parse(dbData, FORMATTER) : null;
    }
}
