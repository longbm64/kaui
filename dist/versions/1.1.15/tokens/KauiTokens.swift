// ============================================================================
// KAUI CSS Kit v1.1.15
// Copyright (c) 2026 KAUI Contributors | Personal / Non-Commercial License
// Official Website: https://kaui.filekat.com
// GitHub Project:  https://github.com/longbm64/kaui
// ============================================================================
import SwiftUI

public enum KauiColors {
    public static let primary50 = Color(red: 239/255.0, green: 246/255.0, blue: 255/255.0)
    public static let primary100 = Color(red: 219/255.0, green: 234/255.0, blue: 254/255.0)
    public static let primary200 = Color(red: 191/255.0, green: 219/255.0, blue: 254/255.0)
    public static let primary300 = Color(red: 147/255.0, green: 197/255.0, blue: 253/255.0)
    public static let primary400 = Color(red: 96/255.0, green: 165/255.0, blue: 250/255.0)
    public static let primary500 = Color(red: 59/255.0, green: 130/255.0, blue: 246/255.0)
    public static let primary600 = Color(red: 37/255.0, green: 99/255.0, blue: 235/255.0)
    public static let primary700 = Color(red: 29/255.0, green: 78/255.0, blue: 216/255.0)
    public static let secondary50 = Color(red: 248/255.0, green: 250/255.0, blue: 252/255.0)
    public static let secondary100 = Color(red: 241/255.0, green: 245/255.0, blue: 249/255.0)
    public static let secondary200 = Color(red: 226/255.0, green: 232/255.0, blue: 240/255.0)
    public static let secondary500 = Color(red: 100/255.0, green: 116/255.0, blue: 139/255.0)
    public static let secondary600 = Color(red: 71/255.0, green: 85/255.0, blue: 105/255.0)
    public static let secondary700 = Color(red: 51/255.0, green: 65/255.0, blue: 85/255.0)
    public static let neutral50 = Color(red: 248/255.0, green: 250/255.0, blue: 252/255.0)
    public static let neutral100 = Color(red: 241/255.0, green: 245/255.0, blue: 249/255.0)
    public static let neutral200 = Color(red: 226/255.0, green: 232/255.0, blue: 240/255.0)
    public static let neutral300 = Color(red: 203/255.0, green: 213/255.0, blue: 225/255.0)
    public static let neutral400 = Color(red: 148/255.0, green: 163/255.0, blue: 184/255.0)
    public static let neutral500 = Color(red: 100/255.0, green: 116/255.0, blue: 139/255.0)
    public static let neutral600 = Color(red: 71/255.0, green: 85/255.0, blue: 105/255.0)
    public static let neutral700 = Color(red: 51/255.0, green: 65/255.0, blue: 85/255.0)
    public static let neutral800 = Color(red: 30/255.0, green: 41/255.0, blue: 59/255.0)
    public static let neutral900 = Color(red: 15/255.0, green: 23/255.0, blue: 42/255.0)
    public static let success50 = Color(red: 236/255.0, green: 253/255.0, blue: 245/255.0)
    public static let success100 = Color(red: 209/255.0, green: 250/255.0, blue: 229/255.0)
    public static let success500 = Color(red: 16/255.0, green: 185/255.0, blue: 129/255.0)
    public static let success600 = Color(red: 5/255.0, green: 150/255.0, blue: 105/255.0)
    public static let success700 = Color(red: 4/255.0, green: 120/255.0, blue: 87/255.0)
    public static let warning50 = Color(red: 255/255.0, green: 251/255.0, blue: 235/255.0)
    public static let warning100 = Color(red: 254/255.0, green: 243/255.0, blue: 199/255.0)
    public static let warning500 = Color(red: 245/255.0, green: 158/255.0, blue: 11/255.0)
    public static let warning600 = Color(red: 217/255.0, green: 119/255.0, blue: 6/255.0)
    public static let warning700 = Color(red: 180/255.0, green: 83/255.0, blue: 9/255.0)
    public static let error50 = Color(red: 254/255.0, green: 242/255.0, blue: 242/255.0)
    public static let error100 = Color(red: 254/255.0, green: 226/255.0, blue: 226/255.0)
    public static let error500 = Color(red: 239/255.0, green: 68/255.0, blue: 68/255.0)
    public static let error600 = Color(red: 220/255.0, green: 38/255.0, blue: 38/255.0)
    public static let error700 = Color(red: 185/255.0, green: 28/255.0, blue: 28/255.0)
    public static let info50 = Color(red: 240/255.0, green: 249/255.0, blue: 255/255.0)
    public static let info100 = Color(red: 224/255.0, green: 242/255.0, blue: 254/255.0)
    public static let info500 = Color(red: 14/255.0, green: 165/255.0, blue: 233/255.0)
    public static let info600 = Color(red: 2/255.0, green: 132/255.0, blue: 199/255.0)
    public static let info700 = Color(red: 3/255.0, green: 105/255.0, blue: 161/255.0)
    public static let amber50 = Color(red: 255/255.0, green: 251/255.0, blue: 235/255.0)
    public static let amber100 = Color(red: 254/255.0, green: 243/255.0, blue: 199/255.0)
    public static let amber200 = Color(red: 253/255.0, green: 230/255.0, blue: 138/255.0)
    public static let amber300 = Color(red: 252/255.0, green: 211/255.0, blue: 77/255.0)
    public static let amber400 = Color(red: 251/255.0, green: 191/255.0, blue: 36/255.0)
    public static let amber500 = Color(red: 245/255.0, green: 158/255.0, blue: 11/255.0)
    public static let amber600 = Color(red: 217/255.0, green: 119/255.0, blue: 6/255.0)
    public static let amber700 = Color(red: 180/255.0, green: 83/255.0, blue: 9/255.0)
    public static let brown50 = Color(red: 250/255.0, green: 250/255.0, blue: 249/255.0)
    public static let brown100 = Color(red: 245/255.0, green: 245/255.0, blue: 244/255.0)
    public static let brown200 = Color(red: 231/255.0, green: 229/255.0, blue: 228/255.0)
    public static let brown300 = Color(red: 214/255.0, green: 211/255.0, blue: 209/255.0)
    public static let brown400 = Color(red: 168/255.0, green: 162/255.0, blue: 158/255.0)
    public static let brown500 = Color(red: 120/255.0, green: 113/255.0, blue: 108/255.0)
    public static let brown600 = Color(red: 87/255.0, green: 83/255.0, blue: 78/255.0)
    public static let brown700 = Color(red: 68/255.0, green: 64/255.0, blue: 60/255.0)
    public static let brown800 = Color(red: 41/255.0, green: 37/255.0, blue: 36/255.0)
    public static let brown900 = Color(red: 28/255.0, green: 25/255.0, blue: 23/255.0)
    public static let surfaceDefault = Color(red: 255/255.0, green: 255/255.0, blue: 255/255.0)
    public static let surfaceSubtle = Color(red: 248/255.0, green: 250/255.0, blue: 252/255.0)
    public static let textMain = Color(red: 15/255.0, green: 23/255.0, blue: 42/255.0)
    public static let textMuted = Color(red: 100/255.0, green: 116/255.0, blue: 139/255.0)
    public static let borderDefault = Color(red: 226/255.0, green: 232/255.0, blue: 240/255.0)
    public static let borderSubtle = Color(red: 241/255.0, green: 245/255.0, blue: 249/255.0)
}

public enum KauiSpacing {
    public static let s0: CGFloat = 0
    public static let s1: CGFloat = 4
    public static let s2: CGFloat = 8
    public static let s3: CGFloat = 12
    public static let s4: CGFloat = 16
    public static let s5: CGFloat = 20
    public static let s6: CGFloat = 24
    public static let s8: CGFloat = 32
    public static let s10: CGFloat = 40
    public static let s12: CGFloat = 48
    public static let s16: CGFloat = 64
}

public enum KauiRadius {
    public static let none: CGFloat = 0
    public static let sm: CGFloat = 4
    public static let md: CGFloat = 6
    public static let lg: CGFloat = 8
    public static let xl: CGFloat = 12
    public static let full: CGFloat = 159984
}
