package com.example.app;
import android.view.SoundEffectConstants;
import android.view.View;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ClickSound")
public class ClickSoundPlugin extends Plugin {

    @PluginMethod()
    public void play(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            View rootView = getActivity().getWindow().getDecorView();
            rootView.playSoundEffect(SoundEffectConstants.CLICK);
        });
        call.resolve();
    }
}
