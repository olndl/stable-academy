import { useEvent, useEventListener } from 'expo';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Course, Lesson } from '../../types/course';
import { ActionButton } from '../../components/ActionButton';
import { AppLink } from '../../components/AppLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  lessonCompletionChanged,
  lessonStarted,
  positionSaved,
} from '../../store/learningSlice';
import { styles as shared } from '../../styles';

export function LessonPlayer({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const dispatch = useAppDispatch();
  const completed = useAppSelector(
    (state) =>
      state.learning.progress[course.id]?.completedLessonIds.includes(
        lesson.id,
      ) ?? false,
  );
  const storedPosition = useAppSelector(
    (state) => state.learning.progress[course.id]?.positions[lesson.id] ?? 0,
  );
  const resumeAt = useRef(completed ? 0 : storedPosition);
  const [retryFailed, setRetryFailed] = useState(false);
  const restored = useRef(false);
  const started = useRef(false);
  const player = useVideoPlayer(lesson.videoUrl, (instance) => {
    instance.timeUpdateEventInterval = 1;
  });
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });

  function savePosition(seconds: number) {
    if (!started.current) return;
    resumeAt.current = seconds;
    dispatch(
      positionSaved({
        courseId: course.id,
        lessonId: lesson.id,
        seconds,
        duration: player.duration,
      }),
    );
  }

  function setCompleted(value: boolean) {
    dispatch(
      lessonCompletionChanged({
        courseId: course.id,
        lessonId: lesson.id,
        lessonIds: course.lessons.map((item) => item.id),
        completed: value,
      }),
    );
  }

  useEventListener(player, 'timeUpdate', ({ currentTime }) =>
    savePosition(currentTime),
  );
  useEventListener(player, 'playingChange', ({ isPlaying: playing }) => {
    if (playing) {
      started.current = true;
      dispatch(lessonStarted({ courseId: course.id, lessonId: lesson.id }));
    } else savePosition(player.currentTime);
  });
  useEventListener(player, 'playToEnd', () => setCompleted(true));

  useEffect(() => {
    function restore() {
      if (!restored.current && player.duration > 0) {
        player.seekBy(
          Math.min(resumeAt.current, Math.max(0, player.duration - 0.25)) -
            player.currentTime,
        );
        restored.current = true;
      }
    }
    const source = player.addListener('sourceLoad', restore);
    const status = player.addListener('statusChange', (event) => {
      if (event.status === 'readyToPlay') restore();
    });
    restore();
    return () => {
      source.remove();
      status.remove();
    };
  }, [player]);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', (state) => {
        if (state !== 'active') player.pause();
      });
      return () => {
        subscription.remove();
        player.pause();
      };
    }, [player]),
  );

  function retry() {
    setRetryFailed(false);
    restored.current = false;
    void player.replaceAsync(lesson.videoUrl).catch(() => setRetryFailed(true));
  }

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        nativeControls
        fullscreenOptions={{ enable: true }}
        contentFit="contain"
        style={styles.video}
      />
      {status === 'loading' && (
        <ActivityIndicator accessibilityLabel="Loading video" color="#286440" />
      )}
      {status === 'error' || retryFailed ? (
        <>
          <Text accessibilityRole="alert" style={shared.text}>
            Could not load the video.
          </Text>
          <ActionButton label="Retry video" onPress={retry} />
        </>
      ) : (
        <ActionButton
          label={isPlaying ? 'Pause' : 'Play'}
          disabled={status !== 'readyToPlay'}
          onPress={() => {
            if (isPlaying) player.pause();
            else {
              if (
                player.duration > 0 &&
                player.currentTime >= player.duration - 0.1
              )
                player.replay();
              player.play();
            }
          }}
        />
      )}
      <Text style={shared.text}>Demo stock footage.</Text>
      {lesson.videoSourceUrl && (
        <AppLink
          href={lesson.videoSourceUrl}
          label={lesson.videoCredit ?? 'Video source'}
        />
      )}
      <ActionButton
        label={completed ? 'Mark as not completed' : 'Mark lesson completed'}
        onPress={() => setCompleted(!completed)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  video: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#111111' },
});
