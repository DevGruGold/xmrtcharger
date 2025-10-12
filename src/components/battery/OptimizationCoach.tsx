import { OptimizationTask, ChargingMode } from '@/types/battery';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface OptimizationCoachProps {
  tasks: OptimizationTask[];
  onTaskToggle: (taskId: string) => void;
  mode: ChargingMode;
}

const getModeTasks = (mode: ChargingMode): OptimizationTask[] => {
  const baseTasks: OptimizationTask[] = [
    {
      id: 'airplane-mode',
      title: 'Enable Airplane Mode',
      description: 'Disables wireless radios for faster charging',
      completed: false,
      impact: 'high',
      category: 'preparation',
    },
    {
      id: 'close-apps',
      title: 'Close Background Apps',
      description: 'Reduces power consumption during charging',
      completed: false,
      impact: 'high',
      category: 'preparation',
    },
    {
      id: 'reduce-brightness',
      title: 'Reduce Screen Brightness',
      description: 'Lower display power usage',
      completed: false,
      impact: 'medium',
      category: 'preparation',
    },
    {
      id: 'disable-location',
      title: 'Disable Location Services',
      description: 'Stops GPS power drain',
      completed: false,
      impact: 'medium',
      category: 'preparation',
    },
    {
      id: 'clean-port',
      title: 'Check Charging Port',
      description: 'Ensure port is clean and cable is secure',
      completed: false,
      impact: 'high',
      category: 'maintenance',
    },
  ];

  if (mode === 'turbo') {
    return [
      ...baseTasks,
      {
        id: 'power-saver',
        title: 'Enable Battery Saver',
        description: 'Reduces system performance for faster charging',
        completed: false,
        impact: 'high',
        category: 'preparation',
      },
    ];
  }

  if (mode === 'calibration') {
    return [
      {
        id: 'drain-battery',
        title: 'Drain to 0%',
        description: 'Let battery fully discharge',
        completed: false,
        impact: 'high',
        category: 'preparation',
      },
      {
        id: 'charge-full',
        title: 'Charge to 100%',
        description: 'Charge without interruption',
        completed: false,
        impact: 'high',
        category: 'during',
      },
      {
        id: 'keep-charged',
        title: 'Keep at 100% for 2 hours',
        description: 'Allows battery to fully calibrate',
        completed: false,
        impact: 'high',
        category: 'during',
      },
    ];
  }

  if (mode === 'emergency') {
    return baseTasks.filter(t => t.impact === 'high');
  }

  return baseTasks;
};

export const OptimizationCoach = ({ tasks: providedTasks, onTaskToggle, mode }: OptimizationCoachProps) => {
  const tasks = providedTasks.length > 0 ? providedTasks : getModeTasks(mode);
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const getImpactColor = (impact: OptimizationTask['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Optimization Guide</h3>
        </div>
        <Badge variant="secondary">
          {completedCount}/{tasks.length}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onTaskToggle(task.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </span>
                <div className={cn('w-2 h-2 rounded-full', getImpactColor(task.impact))} />
              </div>
              <p className="text-xs text-muted-foreground">{task.description}</p>
            </div>
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
