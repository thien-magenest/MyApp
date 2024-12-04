package com.myapp

import android.content.ComponentName
import android.content.pm.PackageManager
import androidx.annotation.DrawableRes
import com.facebook.react.bridge.ReactApplicationContext

data class AppIcon(
    val id: String,
    val component: String,
    @DrawableRes
    val appIcon: Int
)

private val appIcons: List<AppIcon> = listOf(
    AppIcon(
        id = "default",
        component = ".MainActivity",
        appIcon = R.mipmap.ic_launcher
    ),
    AppIcon(
        id = "lavender",
        component = ".MainActivityLavender",
        appIcon = R.mipmap.ic_launcher_lavender
    ),
    AppIcon(
        id = "tree",
        component = ".MainActivityTree",
        appIcon = R.mipmap.ic_launcher_tree
    )
)

class NativeAppIconManagerModule(val reactContext: ReactApplicationContext) :
    NativeAppIconManagerSpec(reactContext) {
    companion object {
        const val NAME = "NativeAppIconManager"
    }

    override fun getName() = NAME

    override fun changeTo(appIconId: String) {
        val context = reactApplicationContext
        val packageManager = context.packageManager

        appIcons.forEach {
            val componentEnabledState = when (true) {
                (it.id == appIconId) -> PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                (it.id == "default") -> PackageManager.COMPONENT_ENABLED_STATE_DISABLED
                else -> PackageManager.COMPONENT_ENABLED_STATE_DEFAULT
            }

            packageManager.setComponentEnabledSetting(
                ComponentName(context, "${BuildConfig.APPLICATION_ID}${it.component}"),
                componentEnabledState,
                PackageManager.DONT_KILL_APP
            )
        }
    }
}
