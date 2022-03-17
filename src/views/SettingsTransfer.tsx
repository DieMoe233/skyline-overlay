import { useCallback, useState } from 'react';
import { runInAction } from 'mobx';
import clsx from 'clsx';
import { useStore, useLongPress, useTranslation } from '../hooks';
import { IDownload, IUpload, IRefresh } from '../assets/icons';

function SettingsTransfer() {
  const { settings } = useStore();
  const t = useTranslation();

  const handleExport = useCallback(() => {
    runInAction(() => {
      const data = settings.exportSettings();
      if (data) {
        prompt(t('Copy to clipboard using Ctrl+C'), data);
      }
    });
  }, [settings, t]);

  const handleImport = useCallback(() => {
    runInAction(() => {
      const data = (prompt(t('Please enter settings data')) || '').trim();
      if (!data) {
        return;
      }
      const res = settings.importSettings(data);
      if (res) {
        location.reload();
      } else {
        alert(t('Invalid settings data'));
      }
    });
  }, [settings, t]);

  const handleClear = useCallback(() => {
    settings.clearSettings();
    window.location.reload();
  }, [settings]);
  // clear settings after 5s
  const { onMouseDown, onTouchStart, onMouseUp, onTouchEnd, onMouseLeave } =
    useLongPress(handleClear, { delay: 5000 });
  // rotating icon
  const [rotate, setRotate] = useState(false);
  const onMouseDownRotate = useCallback(
    (e: unknown) => {
      !rotate && setRotate(true);
      onMouseDown(e);
    },
    [onMouseDown, rotate]
  );
  const onTouchStartRotate = useCallback(
    (e: unknown) => {
      !rotate && setRotate(true);
      onTouchStart(e);
    },
    [onTouchStart, rotate]
  );
  const onMouseUpRotate = useCallback(() => {
    rotate && setRotate(false);
    onMouseUp();
  }, [onMouseUp, rotate]);
  const onTouchEndRotate = useCallback(() => {
    rotate && setRotate(false);
    onTouchEnd();
  }, [onTouchEnd, rotate]);
  const onMouseLeaveRotate = useCallback(() => {
    rotate && setRotate(false);
    onMouseLeave();
  }, [onMouseLeave, rotate]);

  return (
    <div className='settings-transfer'>
      <div className='settings-transfer-btn' onClick={handleExport}>
        <IDownload />
      </div>
      <div className='settings-transfer-btn' onClick={handleImport}>
        <IUpload />
      </div>
      <div
        className={clsx('settings-transfer-btn', {
          'settings-transfer-btn-rotate': rotate,
        })}
        onMouseDown={onMouseDownRotate}
        onTouchStart={onTouchStartRotate}
        onMouseUp={onMouseUpRotate}
        onTouchEnd={onTouchEndRotate}
        onMouseLeave={onMouseLeaveRotate}
      >
        <IRefresh />
      </div>
    </div>
  );
}

export default SettingsTransfer;
